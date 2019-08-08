/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import alertDialog from "Magento_Ui/js/modal/alert";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ContentTypeConfigInterface from "../../content-type-config.types";
import createContentType from "../../content-type-factory";
import Option from "../../content-type-menu/option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import ContentTypeInterface from "../../content-type.types";
import {getDefaultGridSize} from "../column-group/grid-size";
import ColumnGroupPreview from "../column-group/preview";
import {ContentTypeMountEventParamsInterface, ContentTypeMoveEventParamsInterface} from "../content-type-events.types";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";
import {updateColumnWidth} from "./resize";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public resizing: KnockoutObservable<boolean> = ko.observable(false);
    public element: JQuery;

    /**
     * Fields that should not be considered when evaluating whether an object has been configured.
     *
     * @see {Preview.isConfigured}
     * @type {[string]}
     */
    protected fieldsToIgnoreOnRemove: string[] = ["width"];

    /**
     * @param {ContentTypeInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        contentType: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(contentType, config, observableUpdater);

        // Update the width label for the column
        this.contentType.dataStore.subscribe(this.updateColumnWidthClass.bind(this), "width");
        this.contentType.dataStore.subscribe(this.updateDisplayLabel.bind(this), "width");
        this.contentType.dataStore.subscribe(this.triggerChildren.bind(this), "width");
        this.contentType.parentContentType.dataStore.subscribe(this.updateDisplayLabel.bind(this), "grid_size");
    }

    /**
     * Bind events
     */
    public bindEvents() {
        super.bindEvents();

        events.on("column:moveAfter", (args: ContentTypeMoveEventParamsInterface) => {
            if (args.contentType.id === this.contentType.id) {
                this.updateDisplayLabel();
            }
        });

        if (Config.getContentTypeConfig("column-group")) {
            events.on("column:dropAfter", (args: ContentTypeMountEventParamsInterface) => {
                if (args.id === this.contentType.id) {
                    this.createColumnGroup();
                }
            });
        }
    }

    /**
     * Make a reference to the element in the column
     *
     * @param element
     */
    public initColumn(element: Element) {
        this.element = $(element);
        this.updateColumnWidthClass();
        events.trigger("column:initializeAfter", {
            column: this.contentType,
            element: $(element),
            columnGroup: this.contentType.parentContentType,
        });
    }

    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();
        options.move = new Option({
            preview: this,
            icon: "<i class='icon-admin-pagebuilder-handle'></i>",
            title: $t("Move"),
            classes: ["move-column"],
            sort: 10,
        });
        return options;
    }

    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */
    public bindResizeHandle(handle: Element) {
        events.trigger("column:resizeHandleBindAfter", {
            column: this.contentType,
            handle: $(handle),
            columnGroup: this.contentType.parentContentType,
        });
    }

    /**
     * Wrap the current column in a group if it not in a column-group
     *
     * @returns {Promise<ContentTypeCollectionInterface>}
     */
    public createColumnGroup(): Promise<ContentTypeCollectionInterface> {
        if (this.contentType.parentContentType.config.name !== "column-group") {
            const index = this.contentType.parentContentType.children().indexOf(this.contentType);
            // Remove child instantly to stop content jumping around
            this.contentType.parentContentType.removeChild(this.contentType);
            // Create a new instance of column group to wrap our columns with
            const defaultGridSize = getDefaultGridSize();
            return createContentType(
                Config.getContentTypeConfig("column-group"),
                this.contentType.parentContentType,
                this.contentType.stageId,
                {grid_size: defaultGridSize},
            ).then((columnGroup: ContentTypeCollectionInterface) => {
                const col1Width = (Math.ceil(defaultGridSize / 2) * 100 / defaultGridSize).toFixed(
                    Math.round(100 / defaultGridSize) !== 100 / defaultGridSize ? 8 : 0,
                );
                return Promise.all([
                    createContentType(
                        this.contentType.config,
                        columnGroup,
                        columnGroup.stageId,
                        {width: col1Width + "%"},
                    ),
                    createContentType(
                        this.contentType.config,
                        columnGroup,
                        columnGroup.stageId,
                        {width: (100 - parseFloat(col1Width)) + "%"},
                    ),
                ]).then(
                    (columns: [ContentTypeCollectionInterface<Preview>, ContentTypeCollectionInterface<Preview>]) => {
                        columnGroup.addChild(columns[0], 0);
                        columnGroup.addChild(columns[1], 1);
                        this.contentType.parentContentType.addChild(columnGroup, index);

                        this.fireMountEvent(columnGroup, columns[0], columns[1]);
                        return columnGroup;
                    },
                );
            });
        }
    }

    /**
     * Duplicate a child of the current instance
     *
     * @param {ContentTypeCollectionInterface<Preview>} contentType
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeCollectionInterface> | void}
     */
    public clone(
        contentType: ContentTypeCollectionInterface<Preview>,
        autoAppend: boolean = true,
    ): Promise<ContentTypeCollectionInterface> | void {
        const resizeUtils = (this.contentType.parentContentType.preview as ColumnGroupPreview).getResizeUtils();
        // Are we duplicating from a container content type?
        if ( contentType.config.name !== "column"
            || this.contentType.parentContentType.children().length === 0
            || (this.contentType.parentContentType.children().length > 0 && resizeUtils.getColumnsWidth() < 100)
        ) {
            return super.clone(contentType, autoAppend);
        }

        // Attempt to split the current column into parts
        const splitTimes = Math.round(resizeUtils.getColumnWidth(contentType) / resizeUtils.getSmallestColumnWidth());
        if (splitTimes > 1) {
            const splitClone = super.clone(contentType, autoAppend);
            if (splitClone) {
                splitClone.then((duplicateContentType: ContentTypeCollectionInterface<Preview>) => {
                    /**
                     * Distribute the width across the original & duplicated columns, if the we have an odd number of
                     * split times apply it to the original.
                     */
                    const originalWidth = (Math.floor(splitTimes / 2) + (splitTimes % 2))
                        * resizeUtils.getSmallestColumnWidth();
                    const duplicateWidth = Math.floor(splitTimes / 2) * resizeUtils.getSmallestColumnWidth();

                    updateColumnWidth(
                        contentType,
                        resizeUtils.getAcceptedColumnWidth(originalWidth.toString()),
                    );
                    updateColumnWidth(
                        duplicateContentType,
                        resizeUtils.getAcceptedColumnWidth(duplicateWidth.toString()),
                    );

                    return duplicateContentType;
                });
            }
        } else {
            // Conduct an outward search on the children to locate a suitable shrinkable column
            const shrinkableColumn = resizeUtils.findShrinkableColumn(contentType);
            if (shrinkableColumn) {
                const shrinkableClone = super.clone(contentType, autoAppend);
                if (shrinkableClone) {
                    shrinkableClone.then((duplicateContentType: ContentTypeCollectionInterface<Preview>) => {
                        updateColumnWidth(
                            shrinkableColumn,
                            resizeUtils.getAcceptedColumnWidth(
                                (resizeUtils.getColumnWidth(shrinkableColumn)
                                    - resizeUtils.getSmallestColumnWidth()).toString(),
                            ),
                        );
                        updateColumnWidth(
                            duplicateContentType,
                            resizeUtils.getSmallestColumnWidth(),
                        );

                        return duplicateContentType;
                    });
                }
            } else {
                // If we aren't able to duplicate inform the user why
                alertDialog({
                    content: $t("There is no free space within the column group to perform this action."),
                    title: $t("Unable to duplicate column"),
                });
            }
        }
    }

    /**
     * Update the display label for the column
     */
    public updateDisplayLabel() {
        if (this.contentType.parentContentType.preview instanceof ColumnGroupPreview) {
            const newWidth = parseFloat(this.contentType.dataStore.get("width").toString());
            const gridSize = (this.contentType.parentContentType.preview as ColumnGroupPreview).gridSize();
            const newLabel = `${Math.round(newWidth / (100 / gridSize))}/${gridSize}`;
            this.displayLabel(`${$t("Column")} ${newLabel}`);
        }
    }

    /**
     * Syncs the column-width-* class on the children-wrapper with the current width to the nearest tenth rounded up
     */
    public updateColumnWidthClass() {
        // Only update once instantiated
        if (!this.element) {
            return;
        }

        const currentClass = this.element.attr("class").match(/(?:^|\s)(column-width-\d{1,3})(?:$|\s)/);

        if (currentClass !== null) {
            this.element.removeClass(currentClass[1]);
        }

        const roundedWidth = Math.ceil(parseFloat(this.contentType.dataStore.get("width").toString()) / 10) * 10;

        this.element.addClass("column-width-" + roundedWidth);
    }

    /**
     * Fire the mount event for content types
     *
     * @param {ContentTypeInterface[]} contentTypes
     */
    private fireMountEvent(...contentTypes: ContentTypeInterface[]) {
        contentTypes.forEach((contentType) => {
            events.trigger("contentType:mountAfter", {id: contentType.id, contentType});
            events.trigger(contentType.config.name + ":mountAfter", {id: contentType.id, contentType});
        });
    }

    /**
     * Delegate trigger call on children elements.
     */
    private triggerChildren() {
        if (this.contentType.parentContentType.preview instanceof ColumnGroupPreview) {
            const newWidth = parseFloat(this.contentType.dataStore.get("width").toString());

            this.delegate("trigger", "columnWidthChangeAfter", { width: newWidth });
        }
    }
}
