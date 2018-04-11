/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import confirmationDialog from "Magento_PageBuilder/js/modal/dismissible-confirm";
import _, {Dictionary} from "underscore";
import "../../../binding/live-edit";
import DataConverterPool from "../../../component/block/data-converter-pool";
import ElementConverterPool from "../../../component/block/element-converter-pool";
import ContentType from "../../../content-type";
import Convert from "../../../convert";
import appearanceConfig from "../../block/appearance-config";
import {ConfigContentBlock} from "../../config";
import {DataObject} from "../../data-store";
import EventBus from "../../event-bus";
import StyleAttributeFilter from "../../format/style-attribute-filter";
import StyleAttributeMapper, {StyleAttributeMapperResult} from "../../format/style-attribute-mapper";
import Edit from "../../stage/edit";
import { Options } from "../../stage/structural/options";
import {Option} from "../../stage/structural/options/option";
import {OptionInterface} from "../../stage/structural/options/option.d";
import {TitleOption} from "../../stage/structural/options/title";
import Block from "../block";
import "./sortable/binding";

interface PreviewData {
    [key: string]: KnockoutObservable<any>;
}

export default class PreviewBlock {
    public parent: Block;
    public config: any;
    public previewData: PreviewData = {};
    public data: PreviewData = {};
    public displayLabel: KnockoutObservable<string>;
    public previewStyle: KnockoutComputed<StyleAttributeMapperResult>;
    public edit: Edit;
    public title: string = $t("Editable");
    private elementConverterPool: ElementConverterPool;
    private dataConverterPool: DataConverterPool;
    private mouseover: boolean = false;
    private convert: Convert;

    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {object} config
     */
    constructor(
        parent: Block,
        config: ConfigContentBlock,
        elementConverterPool,
        dataConverterPool,
    ) {
        this.elementConverterPool = elementConverterPool;
        this.dataConverterPool = dataConverterPool;
        const styleAttributeMapper = new StyleAttributeMapper();
        const styleAttributeFilter = new StyleAttributeFilter();

        this.parent = parent;
        this.config = config || {};
        this.displayLabel = ko.observable(this.config.label);

        // Create a new instance of edit for our editing needs
        this.edit = new Edit(this.parent, this.parent.store);

        this.convert = new Convert(this.elementConverterPool, this.dataConverterPool);

        this.setupDataFields();

        // Calculate the preview style utilising the style attribute mapper & appearance system
        this.previewStyle = ko.computed(() => {
            const data = _.mapObject(this.previewData, (value) => {
                if (ko.isObservable(value)) {
                    return value();
                }
                return value;
            });

            if (typeof data.appearance !== "undefined" &&
                typeof config.appearances !== "undefined" &&
                typeof config.appearances[data.appearance] !== "undefined") {
                _.extend(data, config.appearances[data.appearance]);
            }

            // Extract data values our of observable functions
            return this.afterStyleMapped(
                styleAttributeMapper.toDom(
                    styleAttributeFilter.filter(data),
                ),
            );
        });

        Object.keys(styleAttributeFilter.getAllowedAttributes()).forEach((key) => {
            if (ko.isObservable(this.previewData[key])) {
                this.previewData[key].subscribe(() => {
                    this.previewStyle.notifySubscribers();
                });
            }
        });

        this.bindEvents();

        this.bindUpdatePreviewObservablesOnChange();
    }

    /**
     * Update data store
     *
     * @param {string} key
     * @param {string} value
     */
    public updateData(key: string, value: string) {
        const data = this.parent.store.get(this.parent.id);

        data[key] = value;
        this.parent.store.update(this.parent.id, data);
    }

    /**
     * Update the data value of a part of our internal Knockout data store
     *
     * @param {string} key
     * @param value
     */
    public updateDataValue(key: string, value: any) {
        if (typeof this.previewData[key] !== "undefined" && ko.isObservable(this.previewData[key])) {
            this.previewData[key](value);
        } else {
            if (_.isArray(value)) {
                this.previewData[key] = ko.observableArray(value);
            } else {
                this.previewData[key] = ko.observable(value);
            }
        }
    }

    /**
     * Set state based on mouseover event for the preview
     *
     * @param {PreviewBlock} context
     * @param {Event} event
     */
    public onMouseOver(context: PreviewBlock, event: Event) {
        if (this.mouseover) {
            return;
        }

        this.mouseover = true;
        const currentTarget = event.currentTarget;
        let optionsMenu = $(currentTarget).find(".pagebuilder-options-wrapper");

        if (!$(currentTarget).hasClass("type-nested")) {
            optionsMenu = optionsMenu.first();
        }

        optionsMenu.parent().addClass("pagebuilder-options-visible");
        $(currentTarget).addClass("pagebuilder-content-type-active");
    }

    /**
     * Set state based on mouseout event for the preview
     *
     * @param {PreviewBlock} context
     * @param {Event} event
     */
    public onMouseOut(context: PreviewBlock, event: Event) {
        this.mouseover = false;
        _.delay(() => {
            if (!this.mouseover) {
                const currentTarget = event.currentTarget;
                let optionsMenu = $(currentTarget).find(".pagebuilder-options-wrapper");

                if (!$(currentTarget).hasClass("type-nested")) {
                    optionsMenu = optionsMenu.first();
                }

                optionsMenu.parent().removeClass("pagebuilder-options-visible");
                $(currentTarget).removeClass("pagebuilder-content-type-active");
            }
        }, 100); // 100 ms delay to allow for users hovering over other elements
    }

    /**
     * After children render fire an event
     *
     * @param {Element} element
     */
    public afterChildrenRender(element: Element): void {
        EventBus.trigger("block:childrenRendered", {id: this.parent.id, block: this.parent, element});
        EventBus.trigger(
            this.parent.config.name + ":block:childrenRendered",
            {
                block: this.parent,
                element,
                id: this.parent.id,
            },
        );
    }

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    public getOptions(): Options {
        return new Options(this, this.retrieveOptions());
    }

    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */
    public retrieveOptions(): OptionInterface[] {
        return [
            new Option(
                this,
                "move",
                "<i class='icon-admin-pagebuilder-handle'></i>",
                $t("Move"),
                null,
                ["move-structural"],
                10,
            ),
            new TitleOption(this, this.config.label, 20),
            new Option(
                this,
                "edit",
                "<i class='icon-admin-pagebuilder-systems'></i>",
                $t("Edit"),
                this.onOptionEdit,
                ["edit-block"],
                30,
            ),
            new Option(
                this,
                "duplicate",
                "<i class='icon-pagebuilder-copy'></i>",
                $t("Duplicate"),
                this.onOptionDuplicate,
                ["duplicate-structural"],
                40,
            ),
            new Option(
                this,
                "remove",
                "<i class='icon-admin-pagebuilder-remove'></i>",
                $t("Remove"),
                this.onOptionRemove,
                ["remove-structural"],
                50,
            ),
        ];
    }

    /**
     * Handle user editing an instance
     */
    public onOptionEdit(): void {
        this.edit.open();
    }

    /**
     * Handle duplicate of items
     */
    public onOptionDuplicate(): void {
        this.clone(this.parent);
    }

    /**
     * Duplicate a child of the current instance
     *
     * @param {ContentTypeInterface} child
     * @param {boolean} autoAppend
     * @returns {ContentTypeInterface}
     */
    public clone(child: ContentTypeInterface, autoAppend: boolean = true): ContentTypeInterface {
        const store = child.store;
        const instance = child.constructor as typeof ContentType;
        const duplicate = new instance(
            child.parent,
            child.config,
            child.stageId,
            child.content.getData(),
            child.previewBuilder,
            child.contentBuilder,
        );
        const index = child.parent.children.indexOf(child) + 1 || null;
        // Copy the data from the data store
        store.update(
            duplicate.id,
            Object.assign({}, store.get(child.id)),
        );
        // Duplicate the instances children into the new duplicate
        if (typeof child.children === "function" && child.children().length > 0) {
            child.children().forEach((subChild: ContentTypeInterface, childIndex: number) => {
                /*
                duplicate.addChild(
                    this.clone(subChild, false),
                    childIndex,
                );
                */
                const createDuplicate = duplicate.preview.clone(subChild, false);
                if (createDuplicate) {
                    duplicate.addChild(
                        createDuplicate,
                        childIndex,
                    );
                }
            });
        }

        // As a new block is being created, we need to fire that event as well
        EventBus.trigger("block:create", {id: duplicate.id, block: duplicate});
        EventBus.trigger(child.parent.config.name + ":block:create", {id: duplicate.id, block: duplicate});

        EventBus.trigger("block:duplicate", {original: child, duplicate, index});
        EventBus.trigger(child.parent.config.name + ":block:duplicate", {original: child, duplicate, index});

        if (autoAppend) {
            child.parent.addChild(duplicate, index);
        }
        return duplicate;
    }

    /**
     * Handle block removal
     */
    public onOptionRemove(): void {
        const removeBlock = () => {
            const params = {
                block: this.parent,
                index: this.parent.parent.getChildren().indexOf(this.parent),
                parent: this.parent.parent,
                stageId: this.parent.stageId,
            };
            EventBus.trigger("block:removed", params);
            EventBus.trigger(this.parent.config.name + ":block:removed", params);
        };

        if (this.isConfigured()) {
            confirmationDialog({
                actions: {
                    confirm: () => {
                        // Call the parent to remove the child element
                        removeBlock();
                    },
                },
                content: $t("Are you sure you want to remove this item? The data within this item is not recoverable once removed."), // tslint:disable-line:max-line-length
                dismissKey: "pagebuilder_modal_dismissed",
                dismissible: true,
                title: $t("Confirm Item Removal"),
            });
        } else {
            removeBlock();
        }
    }

    /**
     * Event called when starting starts on this element
     *
     * @param event
     * @param params
     */
    public onSortStart(event: Event, params: SortParams): void {
        if (params.block.id === this.id) {
            const originalEle = jQuery(params.originalEle);
            originalEle.show();
            originalEle.addClass("pagebuilder-sorting-original");

            // Reset the width & height of the helper
            jQuery(params.helper)
                .css({width: "", height: ""})
                .html(jQuery("<h3 />").text(this.title).html());
        }
    }

    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        EventBus.on("block:sortStart", this.onSortStart.bind(this.parent));
    }

    /**
     * Setup fields observables within the data class property
     */
    protected setupDataFields() {
        // Create an empty observable for all fields
        if (this.config.fields) {
            _.keys(this.config.fields).forEach((key: string) => {
                this.updateDataValue(key, "");
            });
        }

        // Subscribe to this blocks data in the store
        this.parent.store.subscribe(
            (data: DataObject) => {
                _.forEach(data, (value, key) => {
                    this.updateDataValue(key, value);
                });
            },
            this.parent.id,
        );
    }

    /**
     * Callback function to update the styles are mapped
     *
     * @param {StyleAttributeMapperResult} styles
     * @returns {StyleAttributeMapperResult}
     */
    protected afterStyleMapped(styles: StyleAttributeMapperResult) {
        return styles;
    }

    /**
     * Retrieve the preview template
     *
     * @returns {string}
     */
    get previewTemplate(): string {
        const appearance = this.previewData.appearance ? this.previewData.appearance() : undefined;
        let template = appearanceConfig(this.config.name, appearance).preview_template;
        if (undefined === template) {
            template = "Magento_PageBuilder/component/block/preview/abstract.html";
        }
        return template;
    }

    /**
     * Retrieve the preview child template
     *
     * @returns {string}
     */
    get previewChildTemplate(): string {
        return "Magento_PageBuilder/component/block/preview/children.html";
    }

    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    private isConfigured() {
        if (this.parent.children && this.parent.children().length > 0) {
            return true;
        }

        const data = this.parent.store.get(this.parent.id);
        let hasDataChanges = false;
        _.each(this.parent.config.fields, (field, key: string) => {
            let fieldValue = data[key];
            if (!fieldValue) {
                fieldValue = "";
            }
            // Default values can only ever be strings
            if (_.isObject(fieldValue)) {
                // Empty arrays as default values appear as empty strings
                if (_.isArray(fieldValue) && fieldValue.length === 0) {
                    fieldValue = "";
                } else {
                    fieldValue = JSON.stringify(fieldValue);
                }
            }
            if (_.isObject(field.default)) {
                if (JSON.stringify(field.default) !== fieldValue) {
                    hasDataChanges = true;
                }
            } else if (field.default !== fieldValue) {
                hasDataChanges = true;
            }
            return;
        });
        return hasDataChanges;
    }

    /**
     * Attach event to updating data in data store to update observables
     */
    private bindUpdatePreviewObservablesOnChange(): void {
        this.parent.store.subscribe(
            (data: DataObject) => {
                this.convert.updatePreviewObservables(
                    this,
                    _.extend({}, this.parent.store.get(this.parent.id))
                );
                EventBus.trigger("previewObservables:updated", {preview: this});
            },
            this.parent.id,
        );
    }
}

export interface BlockChildrenRenderedEventParams {
    block: Block;
    element: Element;
    id: string;
}
