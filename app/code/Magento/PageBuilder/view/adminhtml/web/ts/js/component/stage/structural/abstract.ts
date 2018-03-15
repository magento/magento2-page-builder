/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import _ from "underscore";
import {ConfigContentBlock} from "../../config";
import Config from "../../config";
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
    private elementConverterPool;
    private converterPool;

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     * @param config
     */
    constructor(
        parent: EditableArea,
        stage: Stage,
        config: ConfigContentBlock,
        elementConverterPool,
        converterPool
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
        let data = this.stage.store.get(this.id);
        if (element === undefined) {
            if ("css_classes" in data && data.css_classes !== "") {
                css = data.css_classes;
            }
        } else {
            const config = Config.getInitConfig("content_types")[this.config.name]['data_mapping']["elements"][element];
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

        const contentTypeConfig = Config.getInitConfig("content_types")[this.config.name];
        let config = contentTypeConfig["data_mapping"]["elements"][element];
        let convertersConfig = contentTypeConfig["data_mapping"]["converters"];
        const appearance = data["appearance"] !== undefined ? data["appearance"] : null;
        if (appearance
            && contentTypeConfig["appearances"] !== undefined
            && contentTypeConfig["appearances"][appearance] !== undefined
            && contentTypeConfig["appearances"][appearance]["data_mapping"] !== undefined
        ) {
            config = contentTypeConfig["appearances"][appearance]["data_mapping"]["elements"][element];
            convertersConfig = contentTypeConfig["appearances"][appearance]["data_mapping"]["converters"];
        }

        for (let key in this.converterPool.getConverters()) {
            for (let i = 0; i < convertersConfig.length; i++) {
                if (convertersConfig[i].name === key) {
                    data = this.converterPool.getConverters()[key].beforeWrite(data, convertersConfig[i].config);
                }
            }
        }

        const result = {};
        if (config.style !== undefined) {
            for (let i = 0; i < config.style.length; i++) {
                let styleProperty = config.style[i];
                let value = data[styleProperty.var];
                const mapper = styleProperty.var + styleProperty.name;
                if (mapper in this.elementConverterPool.getStyleConverters()) {
                    value = this.elementConverterPool.getStyleConverters()[mapper].toDom(data[styleProperty.var], styleProperty.name, data);
                }
                result[this.fromSnakeToCamelCase(styleProperty.name)] = value;
            }
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
        const config = Config.getInitConfig("content_types")[this.config.name]['data_mapping']["elements"][element];
        const result = {};
        if (config.attributes !== undefined) {
            for (let i = 0; i < config.attributes.length; i++) {
                let attribute = config.attributes[i];
                if (attribute.persist !== undefined && attribute.persist !== null && attribute.persist === 'false') {
                    continue;
                }
                let value = data[attribute.var];
                const mapper = attribute.var + attribute.name;
                if (mapper in this.elementConverterPool.getAttributeConverters()) {
                    value = this.elementConverterPool.getAttributeConverters()[mapper].toDom(data[attribute.var], attribute.var, data);
                }
                result[attribute.name] = value;
            }
        }

        return result;
    }

    public getHtml(element: string) {
        const data = this.stage.store.get(this.id);
        const config = Config.getInitConfig("content_types")[this.config.name]['data_mapping']["elements"][element];
        let result = '';
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

    public updateData(data: object) {
        const contentTypeConfig = Config.getInitConfig("content_types")[this.config.name];
        let config = contentTypeConfig["data_mapping"]["elements"];
        const appearance = data["appearance"] !== undefined ? data["appearance"] : null;
        if (appearance
            && contentTypeConfig["appearances"] !== undefined
            && contentTypeConfig["appearances"][appearance] !== undefined
            && contentTypeConfig["appearances"][appearance]["data_mapping"] !== undefined
        ) {
            config = contentTypeConfig["appearances"][appearance]["data_mapping"]["elements"];
        }

        for (const el in config) {
            if (this.data[el] === undefined) {
                this.data[el] = {
                    style: ko.observable({}),
                    attributes: ko.observable({}),
                    html: ko.observable({})
                };
            }
            if (config[el].style !== undefined) {
                const styleObservable = {};
                for (let i = 0; i < config[el].style.length; i++) {
                    const styleProperty = config[el].style[i];
                    let value = data[styleProperty.var];
                    const mapper = styleProperty.var + styleProperty.name;
                    if (mapper in this.elementConverterPool.getStylePreviewConverters()) {
                        value = this.elementConverterPool.getStylePreviewConverters()[mapper].toDom(
                            value,
                            styleProperty.name,
                            this.stage.store.get(this.id)
                        );
                    }
                    styleObservable[this.fromSnakeToCamelCase(styleProperty.name)] = value;
                }
                this.data[el].style(styleObservable);
            }

            if (config[el].attributes !== undefined) {
                const attributesObservable = {};
                for (let i = 0; i < config[el].attributes.length; i++) {
                    const attribute = config[el].attributes[i];
                    let value = data[attribute.var];
                    if (attribute.var in this.elementConverterPool.getAttributeConverters()) {
                        value = this.elementConverterPool.getAttributeConverters()[attribute.var].toDom(data[attribute.var], attribute.var, data);
                    }
                    attributesObservable[attribute.name] = value;
                }
                this.data[el].attributes(attributesObservable);
            }

            if (config[el].html !== undefined) {
                const html = data[config[el].html.var] !== undefined && data[config[el].html.var] !== ""
                    ? data[config[el].html.var]
                    : config[el].html.placeholder;
                this.data[el].html(html);
            }

            if (config[el].tag !== undefined) {
                if (this.data[el][config[el].tag.var] === undefined) {
                    this.data[el][config[el].tag.var] = ko.observable(data[config[el].tag.var]);
                } else {
                    this.data[el][config[el].tag.var](data[config[el].tag.var]);
                }
            }
        }
    }

    private setupDataFields() {
        // Subscribe to this blocks data in the store
        this.stage.store.subscribe(
            (data: DataObject) => {
                _.forEach(data, (value, key) => {
                    this.updateData(data);
                });
            },
            this.id,
        );
    }

    /**
     * Convert from snake case to camel case
     *
     * @param {string} string
     * @returns {string}
     */
    private fromSnakeToCamelCase(currentString: string): string {
        const parts: string[] = currentString.split(/[_-]/);
        let newString: string = "";
        for (let i = 1; i < parts.length; i++) {
            newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
        }
        return parts[0] + newString;
    }
}
