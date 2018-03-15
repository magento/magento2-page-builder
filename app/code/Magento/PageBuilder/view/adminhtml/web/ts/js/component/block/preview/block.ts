/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import _, {Dictionary} from "underscore";
import {ConfigContentBlock} from "../../config";
import {DataObject} from "../../data-store";
import EventBus from "../../event-bus";
import StyleAttributeFilter from "../../format/style-attribute-filter";
import StyleAttributeMapper, {StyleAttributeMapperResult} from "../../format/style-attribute-mapper";
import Block from "../block";
import "./sortable/binding";

// Custom Knockout binding for live editing text inputs
ko.bindingHandlers.liveEdit = {

    /**
     * Init the live edit binding on an element
     *
     * @param element
     * @param valueAccessor
     * @param allBindings
     * @param viewModel
     * @param bindingContext
     */
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        const contentTypeInstance = bindingContext.$data;
        const data = contentTypeInstance.stage.store.get(contentTypeInstance.id);
        const value = valueAccessor();

        const stripHtml = (html) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            return tempDiv.innerText;
        };
        const onBlur = () => {
            if (value in data) {
                data[value] = stripHtml(element.innerText);
                contentTypeInstance.stage.store.update(contentTypeInstance.id, data);
            }
        };
        const onClick = () => {
            document.execCommand("selectAll", false, "");
            if ($(element).hasClass("placeholder-text")) {
                document.execCommand("delete", false, "");
                $(element).removeClass("placeholder-text");
            }

        };
        const onKeyDown = (event) => {
            switch (event.which) {
                case 32:
                    document.execCommand("insertText", false, " "); // fix for space bar
                    break;
                default:
                    return;
            }
        };
        element.contentEditable = true;
        element.addEventListener("blur", onBlur);
        element.addEventListener("click", onClick);
        element.addEventListener("keydown", onKeyDown);
    },
};

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

        optionsMenu.addClass("pagebuilder-options-visible");
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

                optionsMenu.removeClass("pagebuilder-options-visible");
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
