/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import alertDialog from "Magento_Ui/js/modal/alert";
import events from "uiEvents";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.d";
import ContentTypeConfigInterface from "../../content-type-config.d";
import createContentType from "../../content-type-factory";
import Option from "../../content-type-menu/option";
import OptionInterface from "../../content-type-menu/option.d";
import ContentTypeInterface from "../../content-type.d";
import {DataObject} from "../../data-store";
import {StyleAttributeMapperResult} from "../../master-format/style-attribute-mapper";
import ColumnGroupUtils from "../column-group/resizing";
import ContentTypeMountEventParamsInterface from "../content-type-mount-event-params.d";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";

export default class Preview extends PreviewCollection {
    public resizing: KnockoutObservable<boolean> = ko.observable(false);
    public element: JQuery<Element>;
    private columnGroupUtils: ColumnGroupUtils;

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
        this.columnGroupUtils = new ColumnGroupUtils(this.parent.parent);

        // Update the width label for the column
        this.previewData.width.subscribe(this.updateDisplayLabel.bind(this));

        // Update label if the grid size changes
        let originalGridSize = this.columnGroupUtils.getGridSize();
        this.parent.parent.dataStore.subscribe((state: DataObject) => {
            const newGridSize = parseInt(state.gridSize.toString(), 10);
            if (originalGridSize !== newGridSize) {
                this.updateDisplayLabel();
                originalGridSize = newGridSize;
            }
        });
    }

    /**
     * Bind events
     */
    public bindEvents() {
        super.bindEvents();

        if (Config.getContentTypeConfig("column-group")) {
            events.on("column:contentType:mount", (args: ContentTypeMountEventParamsInterface) => {
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
        events.trigger("column:initElement", {
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
        events.trigger("column:bindResizeHandle", {
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
            return createContentType(
                Config.getContentTypeConfig("column-group"),
                this.parent.parent,
                this.parent.stageId,
                {gridSize: Config.getConfig("stage_config").column_grid_size},
            ).then((columnGroup: ContentTypeCollectionInterface) => {
                return Promise.all([
                    createContentType(this.parent.config, columnGroup, columnGroup.stageId, {width: "50%"}),
                    createContentType(this.parent.config, columnGroup, columnGroup.stageId, {width: "50%"}),
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
     * @param {ContentTypeInterface} contentType
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeInterface> | void}
     */
    public clone(
        contentType: ContentTypeCollectionInterface<Preview>,
        autoAppend: boolean = true,
    ): Promise<ContentTypeCollectionInterface> | void {
        // Are we duplicating from a parent?
        if ( contentType.config.name !== "column"
            || this.parent.parent.children().length === 0
            || (this.parent.parent.children().length > 0 && this.columnGroupUtils.getColumnsWidth() < 100)
        ) {
            return super.clone(contentType, autoAppend);
        }

        // Attempt to split the current column into parts
        let splitTimes = Math.round(
            this.columnGroupUtils.getColumnWidth(contentType) / this.columnGroupUtils.getSmallestColumnWidth(),
        );
        if (splitTimes > 1) {
            const splitClone = super.clone(contentType, autoAppend);
            if (splitClone) {
                splitClone.then((duplicateContentType: ContentTypeCollectionInterface<Preview>) => {
                    let originalWidth = 0;
                    let duplicateWidth = 0;

                    for (let i = 0; i <= splitTimes; i++) {
                        if (splitTimes > 0) {
                            originalWidth += this.columnGroupUtils.getSmallestColumnWidth();
                            --splitTimes;
                        }
                        if (splitTimes > 0) {
                            duplicateWidth += this.columnGroupUtils.getSmallestColumnWidth();
                            --splitTimes;
                        }
                    }
                    this.columnGroupUtils.updateColumnWidth(
                        contentType,
                        this.columnGroupUtils.getAcceptedColumnWidth(originalWidth.toString()),
                    );
                    this.columnGroupUtils.updateColumnWidth(
                        duplicateContentType,
                        this.columnGroupUtils.getAcceptedColumnWidth(duplicateWidth.toString()),
                    );

                    return duplicateContentType;
                });
            }
        } else {
            // Conduct an outward search on the children to locate a suitable shrinkable column
            const shrinkableColumn = this.columnGroupUtils.findShrinkableColumn(contentType);
            if (shrinkableColumn) {
                const shrinkableClone = super.clone(contentType, autoAppend);
                if (shrinkableClone) {
                    shrinkableClone.then((duplicateContentType: ContentTypeCollectionInterface<Preview>) => {
                        this.columnGroupUtils.updateColumnWidth(
                            shrinkableColumn,
                            this.columnGroupUtils.getAcceptedColumnWidth(
                                (this.columnGroupUtils.getColumnWidth(shrinkableColumn)
                                    - this.columnGroupUtils.getSmallestColumnWidth()).toString(),
                            ),
                        );
                        this.columnGroupUtils.updateColumnWidth(
                            duplicateContentType,
                            this.columnGroupUtils.getSmallestColumnWidth(),
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
            events.trigger("contentType:mount", {id: contentType.id, contentType});
            events.trigger(contentType.config.name + ":contentType:mount", {id: contentType.id, contentType});
        });
    }

    /**
     * Update the display label for the column
     */
    private updateDisplayLabel() {
        const newWidth = parseFloat(this.parent.dataStore.get().width.toString());
        const gridSize = this.columnGroupUtils.getGridSize();
        const newLabel = `${Math.round(newWidth / (100 / gridSize))}/${gridSize}`;
        this.displayLabel(`${$t("Column")} ${newLabel}`);
    }
}
