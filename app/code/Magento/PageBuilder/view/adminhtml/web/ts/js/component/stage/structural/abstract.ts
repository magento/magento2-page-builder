/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import mageUtils from "mageUtils";
import _ from "underscore";
import appearanceConfig from "../../../component/block/appearance-config";
import DataConverterPool from "../../../component/block/data-converter-pool";
import ElementConverterPool from "../../../component/block/element-converter-pool";
import {fromSnakeToCamelCase} from "../../../utils/string";
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
    public data = {};
    public wrapperStyle: KnockoutObservable<object> = ko.observable({width: "100%"});
    public element: JQuery<HTMLElement>;
    private attributeFilter: AttributeFilter = new AttributeFilter();
    private attributeMapper: AttributeMapper =  new AttributeMapper();
    private styleAttributeFilter: StyleAttributeFilter = new StyleAttributeFilter();
    private styleAttributeMapper: StyleAttributeMapper = new StyleAttributeMapper();
    private elementConverterPool: ElementConverterPool;
    private dataConverterPool: DataConverterPool;

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     * @param config
     * @param elementConverterPool
     * @param dataConverterPool
     */
    constructor(
        parent: EditableArea,
        stage: Stage,
        config: ConfigContentBlock,
        elementConverterPool: ElementConverterPool,
        dataConverterPool: DataConverterPool,
    ) {
        super(stage);
        this.setChildren(this.children);
        this.parent = parent;
        this.config = config;
        this.elementConverterPool = elementConverterPool;
        this.dataConverterPool = dataConverterPool;

        // Create a new instance of edit for our editing needs
        this.edit = new Edit(this, this.stage.store);

        this.bindUpdatePreviewObservablesOnChange();
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
        const removeBlock = () => EventBus.trigger("block:removed", {
            block: this,
            index: this.parent.children().indexOf(this),
            parent: this.parent,
        });

        if (this.isConfigured()) {
            this.stage.parent.confirmationDialog({
                actions: {
                    confirm: () => {
                        // Call the parent to remove the child element
                        removeBlock();
                    },
                },
                content: $t("Are you sure you want to remove this item? " +
                    "The data within this item is not recoverable once removed."),
                dismissKey: "pagebuilder_modal_dismissed",
                dismissible: true,
                title: $t("Confirm Item Removal"),
            });
        } else {
            removeBlock();
        }
    }

    /**
     * Get data for css binding, example {"class-name": true}
     *
     * @returns {DataObject}
     */
    public getCss(element: string) {
        const result: object = {};
        let css: string = "";
        const data = this.stage.store.get(this.id);
        if (element === undefined) {
            if ("css_classes" in data && data.css_classes !== "") {
                css = data.css_classes;
            }
        } else {
            const config = appearanceConfig(this.config.name, data.appearance).data_mapping.elements[element];
            if (config.css && config.css.var !== undefined && config.css.var in data) {
                css = data[config.css.var];
            }
        }
        if (css) {
            css.toString().split(" ").map(
                (value: any, index: number) => result[value] = true,
            );
        }
        return result;
    }

    /**
     * Get data for style binding, example {"backgroundColor": "#cccccc"}
     *
     * @returns {DataObject}
     */
    public getStyle(element: string) {
        let data = _.extend({}, this.stage.store.get(this.id), this.config);
        if (element === undefined) {
            if (typeof data.appearance !== "undefined" &&
                typeof data.appearances !== "undefined" &&
                typeof data.appearances[data.appearance] !== "undefined") {
                _.extend(data, data.appearances[data.appearance]);
            }
            return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(data));
        }

        const appearanceConfiguration = appearanceConfig(this.config.name, data.appearance);
        const config = appearanceConfiguration.data_mapping.elements;

        data = this.convertData(data, appearanceConfiguration.data_mapping.converters);

        let result = {};
        if (config[element].style.length) {
            result = this.convertStyle(config[element], data, "master");
        }
        return result;
    }

    /**
     * Get data for attr binding, example {"data-role": "element"}
     *
     * @returns {DataObject}
     */
    public getAttributes(element: string) {
        let data = _.extend({}, this.stage.store.get(this.id), this.config);
        if (element === undefined) {
            if (undefined === data.appearance || !data.appearance) {
                data.appearance = undefined !== this.config.fields.appearance
                    ? this.config.fields.appearance.default
                    : "default";
            }
            return this.attributeMapper.toDom(this.attributeFilter.filter(data));
        }

        const appearanceConfiguration = appearanceConfig(this.config.name, data.appearance);
        const config = appearanceConfiguration.data_mapping.elements;

        data = this.convertData(data, appearanceConfiguration.data_mapping.converters);

        let result = {};
        if (config[element].attributes.length) {
            result = this.convertAttributes(config[element], data, "master");
        }

        return result;
    }

    /**
     * Get data for html binding
     *
     * @param {string} element
     * @returns {object}
     */
    public getHtml(element: string) {
        const data = this.stage.store.get(this.id);
        const config = appearanceConfig(this.config.name, data.appearance).data_mapping.elements[element];
        let result = "";
        if (undefined !== config.html.var) {
            result = data[config.html.var];
        }
        return result;
    }

    /**
     * Get block data
     *
     * @param {string} element
     * @returns {DataObject}
     */
    public getData(element: string) {
        let data = _.extend({}, this.stage.store.get(this.id));

        if (undefined === element) {
            return data;
        }

        const appearanceConfiguration = appearanceConfig(this.config.name, data.appearance);
        const config = appearanceConfiguration.data_mapping.elements;

        data = this.convertData(data, appearanceConfiguration.data_mapping.converters);

        const result = {};
        if (undefined !== config[element].tag.var) {
            result[config[element].tag.var] = data[config[element].tag.var];
        }
        return result;
    }

    /**
     * Callback function for after preview observables are updated
     */
    protected afterDataRendered() {
        return;
    }

    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    private isConfigured() {
        if (this.children().length > 0) {
            return true;
        }

        const data = this.getData();
        let hasDataChanges = false;
        _.each(this.config.fields, (field, key: string) => {
            let fieldValue = data[key];
            // Default values can only ever be strings
            if (_.isObject(fieldValue)) {
                fieldValue = JSON.stringify(fieldValue);
            }
            if (field.default !== fieldValue) {
                hasDataChanges = true;
                return;
            }
        });
        return hasDataChanges;
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
     * Convert attributes
     *
     * @param {object} config
     * @param {DataObject} data
     * @param {string} area
     * @returns {object}
     */
    private convertAttributes(config: any, data: DataObject, area: string) {
        const result = {};
        for (const attributeConfig of config.attributes) {
             if (undefined !== attributeConfig.persist
                 && null !== attributeConfig.persist
                 && false === !!attributeConfig.persist
             ) {
                continue;
            }
             let value = data[attributeConfig.var];
             const converter = "preview" === area && attributeConfig.preview_converter
                ? attributeConfig.preview_converter
                : attributeConfig.converter;
             if (this.elementConverterPool.get(converter)) {
                value = this.elementConverterPool.get(converter).toDom(attributeConfig.var, data);
            }
             result[attributeConfig.name] = value;
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
        if (config.style) {
            for (const propertyConfig of config.style) {
                if (undefined !== propertyConfig.persist
                    && null !== propertyConfig.persist
                    && false === !!propertyConfig.persist
                ) {
                    continue;
                }
                let value = "";
                if (!!propertyConfig.static) {
                    value = propertyConfig.value;
                } else {
                    value = data[propertyConfig.var];
                    const converter = "preview" === area && propertyConfig.preview_converter
                        ? propertyConfig.preview_converter
                        : propertyConfig.converter;
                    if (this.elementConverterPool.get(converter)) {
                        value = this.elementConverterPool.get(converter).toDom(propertyConfig.var, data);
                    }
                }
                if (typeof value === "object") {
                    _.extend(result, value);
                } else {
                    result[fromSnakeToCamelCase(propertyConfig.name)] = value;
                }
            }
        }
        return result;
    }

    /**
     * Process data for elements before its converted to knockout format
     *
     * @param {Object} data
     * @param {Object} convertersConfig
     * @returns {Object}
     */
    private convertData(data: object, convertersConfig: object) {
        for (const converterConfig of convertersConfig) {
            data = this.dataConverterPool.get(converterConfig.component).toDom(data, converterConfig.config);
        }
        return data;
    }

    /**
     * Update preview observables after data changed in data store
     *
     * @param {object} data
     */
    private updatePreviewObservables(data: object) {
        const appearance = data && data.appearance !== undefined ? data.appearance : undefined;
        const appearanceConfiguration = appearanceConfig(this.config.name, appearance);
        if (undefined === appearanceConfiguration
            || undefined === appearanceConfiguration.data_mapping
            || undefined === appearanceConfiguration.data_mapping.elements
        ) {
            return;
        }

        const config = appearanceConfiguration.data_mapping.elements;

        for (const elementName of Object.keys(config)) {
            if (this.data[elementName] === undefined) {
                this.data[elementName] = {
                    attributes: ko.observable({}),
                    style: ko.observable({}),
                    css: ko.observable({}),
                    html: ko.observable({}),
                };
            }

            data = this.convertData(data, appearanceConfiguration.data_mapping.converters);

            if (config[elementName].style !== undefined) {
               this.data[elementName].style(this.convertStyle(config[elementName], data, "preview"));
            }
            if (config[elementName].attributes !== undefined) {
                this.data[elementName].attributes(this.convertAttributes(config[elementName], data, "preview"));
            }
            if (config[elementName].html !== undefined) {
                const html = data[config[elementName].html.var]
                    ? data[config[elementName].html.var]
                    : config[elementName].html.placeholder;
                this.data[elementName].html(html);
            }
            if (config[elementName].css !== undefined && config[elementName].css.var in data) {
                const css = data[config[elementName].css.var];
                const newClasses = {};

                if (css.length > 0) {
                    css.toString().split(" ").map(
                        (value: any, index: number) => newClasses[value] = true,
                    );
                }
                for (const className of Object.keys(this.data[elementName].css())) {
                    if (!(className in newClasses)) {
                        newClasses[className] = false;
                    }
                }
                this.data[elementName].css(newClasses);
            }
            if (config[elementName].tag !== undefined) {
                if (this.data[elementName][config[elementName].tag.var] === undefined) {
                    this.data[elementName][config[elementName].tag.var] = ko.observable("");
                }
                this.data[elementName][config[elementName].tag.var](data[config[elementName].tag.var]);
            }

            this.afterDataRendered();
        }
    }

    /**
     * Attach event to updating data in data store to update observables
     */
    private bindUpdatePreviewObservablesOnChange(): void {
        this.stage.store.subscribe(
            (data: DataObject) => {
                this.updatePreviewObservables(_.extend({}, this.stage.store.get(this.id)));
            },
            this.id,
        );
    }
}
