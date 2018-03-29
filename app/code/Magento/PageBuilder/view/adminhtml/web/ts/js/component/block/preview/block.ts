/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import _, {Dictionary} from "underscore";
import "../../../binding/live-edit";
import {ConfigContentBlock} from "../../config";
import {DataObject} from "../../data-store";
import EventBus from "../../event-bus";
import StyleAttributeFilter from "../../format/style-attribute-filter";
import StyleAttributeMapper, {StyleAttributeMapperResult} from "../../format/style-attribute-mapper";
import Block from "../block";
import "./sortable/binding";

interface PreviewData {
    [key: string]: KnockoutObservable<any>;
}

export default class PreviewBlock {
    public parent: Block;
    public config: any;
    public data: PreviewData = {};
    public displayLabel: KnockoutObservable<string>;
    public previewStyle: KnockoutComputed<StyleAttributeMapperResult>;
    private mouseover: boolean = false;

    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {object} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        const styleAttributeMapper = new StyleAttributeMapper();
        const styleAttributeFilter = new StyleAttributeFilter();

        this.parent = parent;
        this.config = config || {};
        this.displayLabel = ko.observable(this.config.label);

        this.setupDataFields();

        // Calculate the preview style utilising the style attribute mapper & appearance system
        this.previewStyle = ko.computed(() => {
            const data = _.mapObject(this.data, (value) => {
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
            if (ko.isObservable(this.data[key])) {
                this.data[key].subscribe(() => {
                    this.previewStyle.notifySubscribers();
                });
            }
        });
    }

    /**
     * Retrieve the template for the preview block
     *
     * @returns {string}
     */
    get template(): string {
        if (this.config.preview_template) {
            return this.config.preview_template;
        }
        return "";
    }

    /**
     * Update data store
     *
     * @param {string} key
     * @param {string} value
     */
    public updateData(key: string, value: string) {
        const data = this.parent.stage.store.get(this.parent.id);

        data[key] = value;
        this.parent.stage.store.update(this.parent.id, data);
    }

    /**
     * Update the data value of a part of our internal Knockout data store
     *
     * @param {string} key
     * @param value
     */
    public updateDataValue(key: string, value: any) {
        if (typeof this.data[key] !== "undefined" && ko.isObservable(this.data[key])) {
            this.data[key](value);
        } else {
            if (_.isArray(value)) {
                this.data[key] = ko.observableArray(value);
            } else {
                this.data[key] = ko.observable(value);
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
        this.parent.stage.store.subscribe(
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
}

export interface BlockChildrenRenderedEventParams {
    block: Block;
    element: Element;
    id: string;
}
