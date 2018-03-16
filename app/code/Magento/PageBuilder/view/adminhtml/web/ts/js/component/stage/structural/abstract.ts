/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import _ from "underscore";
import ConverterPool from "../../../component/block/converter-pool";
import ElementConverterPool from "../../../component/block/element-converter-pool";
import {fromSnakeToCamelCase} from "../../../utils/string";
import Config from "../../config";
import {ConfigContentBlock} from "../../config";
import {DataObject} from "../../data-store";
import EventBus from "../../event-bus";
import AttributeFilter from "../../format/attribute-filter";
import AttributeMapper from "../../format/attribute-mapper";
import StyleAttributeFilter from "../../format/style-attribute-filter";
import StyleAttributeMapper from "../../format/style-attribute-mapper";
import Stage from "../../stage";
import Edit from "../edit";
import { Structural as StructuralInterface } from "./abstract.d";
import EditableArea from "./editable-area";
import { Options } from "./options";
import {Option} from "./options/option";
import {OptionInterface} from "./options/option.d";
import {TitleOption} from "./options/title";

export default class Structural extends EditableArea implements StructuralInterface {
    public config: ConfigContentBlock;
    public children: KnockoutObservableArray<Structural> = ko.observableArray([]);
    public edit: Edit;
    public title: string;
    public wrapperStyle: KnockoutObservable<object> = ko.observable({width: "100%"});
    public element: JQuery<HTMLElement>;
    private attributeFilter: AttributeFilter = new AttributeFilter();
    private attributeMapper: AttributeMapper =  new AttributeMapper();
    private styleAttributeFilter: StyleAttributeFilter = new StyleAttributeFilter();
    private styleAttributeMapper: StyleAttributeMapper = new StyleAttributeMapper();

    public data = {};
    public elementConverterPool: ElementConverterPool;
    public converterPool: ConverterPool;

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     * @param config
     * @param elementConverterPool
     * @param converterPool
     */
    constructor(
        parent: EditableArea,
        stage: Stage,
        config: ConfigContentBlock,
        elementConverterPool: ElementConverterPool,
        converterPool: ConverterPool,
    ) {
        super(stage);
        this.setChildren(this.children);
        this.parent = parent;
        this.config = config;
        this.elementConverterPool = elementConverterPool;
        this.converterPool = converterPool;

        // Create a new instance of edit for our editing needs
        this.edit = new Edit(this, this.stage.store);

        this.setupDataFields();
    }

    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */
    public retrieveOptions(): OptionInterface[] {
        return [
            new Option(this, "move", "<i></i>", $t("Move"), null, ["move-structural"], 10),
            new TitleOption(this, this.config.label, 20),
            new Option(this, "edit", "<i></i>", $t("Edit"), this.onOptionEdit, ["edit-block"], 30),
            new Option(
                this,
                "duplicate",
                "<i class='icon-pagebuilder-copy'></i>",
                $t("Duplicate"),
                this.onOptionDuplicate,
                ["duplicate-structural"],
                40,
            ),
            new Option(this, "remove", "<i></i>", $t("Remove"), this.onOptionRemove, ["remove-structural"], 50),
        ];
    }

    /**
     * Retrieve the template for the structural
     *
     * @returns {string}
     */
    get template(): string {
        return "Magento_PageBuilder/component/stage/structural/abstract.html";
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
     * Retrieve the child template
     *
     * @returns {string}
     */
    get renderChildTemplate(): string {
        return "Magento_PageBuilder/component/block/render/children.html";
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
        this.parent.duplicateChild(this);
    }

    /**
     * Handle block removal
     */
    public onOptionRemove(): void {
        this.stage.parent.confirmationDialog({
            actions: {
                confirm: () => {
                    // Call the parent to remove the child element
                    EventBus.trigger("block:removed", {
                        block: this,
                        index: this.parent.children().indexOf(this),
                        parent: this.parent,
                    });
                },
            },
            content: $t("Are you sure you want to remove this item? " +
                "The data within this item is not recoverable once removed."),
            title: $t("Confirm Item Removal"),
        });
    }

    /**
     * Get css classes for an block
     * Example {"class-name": true}
     *
     * @returns {DataObject}
     */
    public getCss(element: string) {
        let css: object = {};
        const data = this.stage.store.get(this.id);
        if (element === undefined) {
            if ("css_classes" in data && data.css_classes !== "") {
                css = data.css_classes;
            }
        } else {
            const config = Config.getContentType(this.config.name).data_mapping.elements[element];
            if (config.css.var !== undefined && config.css.var in data) {
                css = data[config.css.var];
            }
        }
        css.toString().split(" ").map(
            (value: any, index: number) => css[value] = true,
        );
        return css;
    }

    /**
     * Get stype properties for an block
     * Example {"backgroundColor": "#cccccc"}
     *
     * @returns {DataObject}
     */
    public getStyle(element: string) {
        if (element === undefined) {
            const styleAttributes = this.getData();
            if (typeof styleAttributes.appearance !== "undefined" &&
                typeof styleAttributes.appearances !== "undefined" &&
                typeof styleAttributes.appearances[styleAttributes.appearance] !== "undefined") {
                _.extend(styleAttributes, styleAttributes.appearances[styleAttributes.appearance]);
            }
            return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(styleAttributes));
        }

        let data = _.extend({}, this.stage.store.get(this.id));
        const config = this.getAppearanceConfig(data.appearance).elements;
        const convertersConfig = this.getAppearanceConfig(data.appearance).converters;

        for (const key in this.converterPool.getConverters()) {
            for (let i = 0; i < convertersConfig.length; i++) {
                if (convertersConfig[i].name === key) {
                    data = this.converterPool.getConverters()[key].beforeWrite(data, convertersConfig[i].config);
                }
            }
        }

        let result = {};
        if (config[element] !== undefined) {
            result = this.convertStyle(config[element], data, "master");
        }
        return result;
    }

    /**
     * Convert style properties
     *
     * @param {object}config
     * @param {object}data
     * @param {string} area
     * @returns {object}
     */
    private convertStyle(config: any, data: any, area: string) {
        const result = {};
        for (let i = 0; i < config.style.length; i++) {
            const styleProperty = config.style[i];
            let value = data[styleProperty.var];
            const mapper = styleProperty.var + styleProperty.name;
            if (mapper in this.elementConverterPool.getStyleConverters(area)) {
                value = this.elementConverterPool.getStyleConverters(area)[mapper].toDom(
                    value,
                    styleProperty.name,
                    data,
                );
            }
            result[fromSnakeToCamelCase(styleProperty.name)] = value;
        }
        return result;
    }

    /**
     * Get attributes for an block
     * Example {"data-role": "element"}
     *
     * @returns {DataObject}
     */
    public getAttributes(element: string) {
        if (element === undefined) {
            const data: DataObject = this.getData();
            _.extend(data, this.config);
            return this.attributeMapper.toDom(this.attributeFilter.filter(data));
        }

        let data = this.stage.store.get(this.id);
        data = _.extend(data, this.config);
        const config = Config.getContentType(this.config.name).data_mapping.elements[element];
        let result = {};
        if (config.attributes !== undefined) {
            result = this.convertAttributes(config, data, "master");
        }

        return result;
    }

    /**
     * Convert attributes
     *
     * @param {object}config
     * @param {DataObject} data
     * @param {string} area
     * @returns {object}
     */
    private convertAttributes(config: any, data: DataObject, area: string) {
        const result = {};
        for (let i = 0; i < config.attributes.length; i++) {
            const attribute = config.attributes[i];
            if (attribute.persist !== undefined && attribute.persist !== null && attribute.persist === "false") {
                continue;
            }
            let value = data[attribute.var];
            const mapper = attribute.var + attribute.name;
            if (mapper in this.elementConverterPool.getAttributeConverters(area)) {
                value = this.elementConverterPool.getAttributeConverters(area)[mapper].toDom(value, attribute.var, data);
            }
            result[attribute.name] = value;
        }
        return result;
    }

    public getHtml(element: string) {
        const data = this.stage.store.get(this.id);
        const config = Config.getContentType(this.config.name).data_mapping.elements[element];
        let result = "";
        if (config.html !== undefined) {
            result = data[config.html.var];
        }
        return result;
    }

    /**
     * Get block data
     *
     * @returns {DataObject}
     */
    public getData() {
        return this.stage.store.get(this.id);
    }

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    private getOptions(): Options {
        return new Options(this, this.retrieveOptions());
    }

    /**
     * Get config for appearance
     *
     * @param {string} appearance
     * @returns {Object}
     */
    private getAppearanceConfig(appearance: string): object {
        const contentTypeConfig = Config.getContentType(this.config.name);
        let config = contentTypeConfig.data_mapping;
        if (appearance !== undefined
            && contentTypeConfig.appearances !== undefined
            && contentTypeConfig.appearances[appearance] !== undefined
            && contentTypeConfig.appearances[appearance].data_mapping !== undefined
        ) {
            config = contentTypeConfig.appearances[appearance].data_mapping;
        }
        return config;
    }

    public updateData(data: object) {
        const config = this.getAppearanceConfig(data.appearance).elements;

        for (const elementName in config) {
            if (this.data[elementName] === undefined) {
                this.data[elementName] = {
                    style: ko.observable({}),
                    attributes: ko.observable({}),
                    html: ko.observable({}),
                };
            }
            if (config[elementName].style !== undefined) {
               this.data[elementName].style(this.convertStyle(config[elementName], data, "preview"));
            }
            if (config[elementName].attributes !== undefined) {
                this.data[elementName].attributes(this.convertAttributes(config[elementName], data, "preview"));
            }
            if (config[elementName].html !== undefined) {
                const html = data[config[elementName].html.var] !== undefined && data[config[elementName].html.var] !== ""
                    ? data[config[elementName].html.var]
                    : config[elementName].html.placeholder;
                this.data[elementName].html(html);
            }
            if (config[elementName].tag !== undefined) {
                if (this.data[elementName][config[elementName].tag.var] === undefined) {
                    this.data[elementName][config[elementName].tag.var] = ko.observable("");
                }
                this.data[elementName][config[elementName].tag.var](data[config[elementName].tag.var]);
            }
        }
    }

    /**
     * Attach event to updating data in data store to update observables
     */
    private setupDataFields(): void {
        this.stage.store.subscribe(
            (data: DataObject) => {
                this.updateData(data);
            },
            this.id,
        );
    }
}
