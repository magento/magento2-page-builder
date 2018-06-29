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
import ContentTypeCollectionInterface from "../../content-type-collection.d";
import ContentTypeConfigInterface from "../../content-type-config.d";
import createContentType from "../../content-type-factory";
import Option from "../../content-type-menu/option";
import OptionInterface from "../../content-type-menu/option.d";
import ContentTypeInterface from "../../content-type.d";
import {StyleAttributeMapperResult} from "../../master-format/style-attribute-mapper";
import {getDefaultGridSize} from "../column-group/grid-size";
import ColumnGroupPreview from "../column-group/preview";
import ContentTypeMountEventParamsInterface from "../content-type-mount-event-params.d";
import {ContentTypeMoveEventParamsInterface} from "../content-type-move-event-params";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";
import {updateColumnWidth} from "./resize";

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
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);

        // Update the width label for the column
        this.parent.dataStore.subscribe(this.updateDisplayLabel.bind(this), "width");
        this.parent.parent.dataStore.subscribe(this.updateDisplayLabel.bind(this), "grid_size");
    }

    /**
     * Bind events
     */
    public bindEvents() {
        super.bindEvents();

        events.on("column:moveAfter", (args: ContentTypeMoveEventParamsInterface) => {
            if (args.contentType.id === this.parent.id) {
                this.updateDisplayLabel();
            }
        });

        if (Config.getContentTypeConfig("column-group")) {
            events.on("column:dropAfter", (args: ContentTypeMountEventParamsInterface) => {
                if (args.id === this.parent.id) {
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
        events.trigger("column:initializeAfter", {
            column: this.parent,
            element: $(element),
            parent: this.parent.parent,
        });
    }

    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */
    public retrieveOptions(): OptionInterface[] {
        const options = super.retrieveOptions();
        const newOptions = options.filter((option) => {
            return (option.code !== "move");
        });
        newOptions.unshift(
            new Option(
                this,
                "move",
                "<i class='icon-admin-pagebuilder-handle'></i>",
                $t("Move"),
                null,
                ["move-column"],
                10,
            ),
        );
        return newOptions;
    }

    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */
    public bindResizeHandle(handle: Element) {
        events.trigger("column:resizeHandleBindAfter", {
            column: this.parent,
            handle: $(handle),
            parent: this.parent.parent,
        });
    }

    /**
     * Wrap the current column in a group if it not in a column-group
     *
     * @returns {Promise<ContentTypeCollectionInterface>}
     */
    public createColumnGroup(): Promise<ContentTypeCollectionInterface> {
        if (this.parent.parent.config.name !== "column-group") {
            const index = this.parent.parent.children().indexOf(this.parent);
            // Remove child instantly to stop content jumping around
            this.parent.parent.removeChild(this.parent);
            // Create a new instance of column group to wrap our columns with
            const defaultGridSize = getDefaultGridSize();
            return createContentType(
                Config.getContentTypeConfig("column-group"),
                this.parent.parent,
                this.parent.stageId,
                {grid_size: defaultGridSize},
            ).then((columnGroup: ContentTypeCollectionInterface) => {
                const col1Width = (Math.ceil(defaultGridSize / 2) * 100 / defaultGridSize).toFixed(
                    Math.round(100 / defaultGridSize) !== 100 / defaultGridSize ? 8 : 0,
                );
                return Promise.all([
                    createContentType(
                        this.parent.config,
                        columnGroup,
                        columnGroup.stageId,
                        {width: col1Width + "%"},
                    ),
                    createContentType(
                        this.parent.config,
                        columnGroup,
                        columnGroup.stageId,
                        {width: (100 - parseFloat(col1Width)) + "%"},
                    ),
                ]).then(
                    (columns: [ContentTypeCollectionInterface<Preview>, ContentTypeCollectionInterface<Preview>]) => {
                        columnGroup.addChild(columns[0], 0);
                        columnGroup.addChild(columns[1], 1);
                        this.parent.parent.addChild(columnGroup, index);

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
        const resizeUtils = (this.parent.parent.preview as ColumnGroupPreview).getResizeUtils();
        // Are we duplicating from a parent?
        if ( contentType.config.name !== "column"
            || this.parent.parent.children().length === 0
            || (this.parent.parent.children().length > 0 && resizeUtils.getColumnsWidth() < 100)
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
        if (this.parent.parent.preview instanceof ColumnGroupPreview) {
            const newWidth = parseFloat(this.parent.dataStore.get("width").toString());
            const gridSize = (this.parent.parent.preview as ColumnGroupPreview).gridSize();
            const newLabel = `${Math.round(newWidth / (100 / gridSize))}/${gridSize}`;
            this.displayLabel(`${$t("Column")} ${newLabel}`);
        }
    }

    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */
    protected afterStyleMapped(styles: StyleAttributeMapperResult) {
        // Extract data values our of observable functions
        // The style attribute mapper converts images to directives, override it to include the correct URL
        if (this.previewData.background_image && typeof this.previewData.background_image()[0] === "object") {
            styles.backgroundImage = "url(" + this.previewData.background_image()[0].url + ")";
        }

        // If we have left and right margins we need to minus this from the total width
        if (this.previewData.margins_and_padding && this.previewData.margins_and_padding().margin) {
            const margins = this.previewData.margins_and_padding().margin;
            const horizontalMargin = parseInt(margins.left || 0, 10) +
                parseInt(margins.right || 0, 10);
            styles.width = "calc(" + styles.width + " - " + horizontalMargin + "px)";
        }

        // If the right margin is 0, we set it to 1px to overlap the columns to create a single border
        if (styles.marginRight === "0px") {
            styles.marginRight = "1px";
        }

        // If the border is set to default we show no border in the admin preview, as we're unaware of the themes styles
        if (this.previewData.border && this.previewData.border() === "_default") {
            styles.border = "none";
        }

        return styles;
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
}
