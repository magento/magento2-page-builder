/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import confirmationDialog from "Magento_PageBuilder/js/modal/dismissible-confirm";
import _ from "underscore";
import "./binding/live-edit";
import appearanceConfig from "./component/block/appearance-config";
import "./component/block/preview/sortable/binding";
import {DataObject} from "./component/data-store";
import EventBus from "./component/event-bus";
import StyleAttributeFilter from "./component/format/style-attribute-filter";
import StyleAttributeMapper, {StyleAttributeMapperResult} from "./component/format/style-attribute-mapper";
import Edit from "./component/stage/edit";
import {Options} from "./component/stage/structural/options";
import {Option} from "./component/stage/structural/options/option";
import {OptionInterface} from "./component/stage/structural/options/option.d";
import {TitleOption} from "./component/stage/structural/options/title";
import ContentTypeConfigInterface from "./content-type-config.d";
import ContentTypeInterface from "./content-type.d";
import ObservableUpdater from "./observable-updater";
import ObservableObject from "./observable-object.d";

export default class Preview {
    public parent: ContentTypeInterface;
    public config: ContentTypeConfigInterface;
    public data: ObservableObject = {};
    public displayLabel: KnockoutObservable<string>;
    public edit: Edit;
    /**
     * @deprecated
     */
    public previewData: ObservableObject = {};
    /**
     * @deprecated
     */
    public previewStyle: KnockoutComputed<StyleAttributeMapperResult>;
    private observableUpdater: ObservableUpdater;
    private mouseover: boolean = false;

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
        this.parent = parent;
        this.config = config;
        this.edit = new Edit(this.parent, this.parent.store);
        this.observableUpdater = observableUpdater;
        this.displayLabel = ko.observable(this.config.label);
        this.setupDataFields();
        this.bindEvents();
    }

    /**
     * Retrieve the preview template
     *
     * @returns {string}
     */
    get previewTemplate(): string {
        const appearance = this.previewData.appearance ? this.previewData.appearance() : undefined;
        return appearanceConfig(this.config.name, appearance).preview_template;
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
     * @deprecated
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
     * @param {Preview} context
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
     * @param {Preview} context
     * @param {Event} event
     */
    public onMouseOut(context: Preview, event: Event) {
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
     * @deprecated
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
        this.parent.store.subscribe(
            (data: DataObject) => {
                this.observableUpdater.update(
                    this,
                    _.extend({}, this.parent.store.get(this.parent.id)),
                );
                EventBus.trigger("previewObservables:updated", {preview: this});
            },
            this.parent.id,
        );
    }

    /**
     * Setup fields observables within the data class property
     *
     * @deprecated
     */
    protected setupDataFields() {
        const styleAttributeMapper = new StyleAttributeMapper();
        const styleAttributeFilter = new StyleAttributeFilter();

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

        // Calculate the preview style utilising the style attribute mapper & appearance system
        this.previewStyle = ko.computed(() => {
            const data = _.mapObject(this.previewData, (value) => {
                if (ko.isObservable(value)) {
                    return value();
                }
                return value;
            });

            if (typeof data.appearance !== "undefined" &&
                typeof this.config.appearances !== "undefined" &&
                typeof this.config.appearances[data.appearance] !== "undefined") {
                _.extend(data, this.config.appearances[data.appearance]);
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
    }

    /**
     * Callback function to update the styles are mapped
     *
     * @param {StyleAttributeMapperResult} styles
     * @returns {StyleAttributeMapperResult}
     * @deprecated
     */
    protected afterStyleMapped(styles: StyleAttributeMapperResult) {
        return styles;
    }

    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    private isConfigured() {
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
}
