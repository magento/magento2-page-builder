/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import DataConverterPool from "./component/block/data-converter-pool";
import ElementConverterPool from "./component/block/element-converter-pool";
import {DataObject} from "./component/data-store";
import appearanceConfig from "./component/block/appearance-config";
import {fromSnakeToCamelCase} from "./utils/string";
import AttributeFilter from "./component/format/attribute-filter";
import AttributeMapper from "./component/format/attribute-mapper";
import StyleAttributeFilter from "./component/format/style-attribute-filter";
import StyleAttributeMapper from "./component/format/style-attribute-mapper";
import Convert from "./convert";

export default class Content {
    public data = {};
    private parent;
    private elementConverterPool: ElementConverterPool;
    private dataConverterPool: DataConverterPool;
    private attributeFilter: AttributeFilter = new AttributeFilter();
    private attributeMapper: AttributeMapper =  new AttributeMapper();
    private styleAttributeFilter: StyleAttributeFilter = new StyleAttributeFilter();
    private styleAttributeMapper: StyleAttributeMapper = new StyleAttributeMapper();

    /**
     * @param parent
     * @param elementConverterPool
     * @param dataConverterPool
     */
    constructor(
        parent,
        elementConverterPool: ElementConverterPool,
        dataConverterPool: DataConverterPool,
    ) {
        this.parent = parent;
        this.elementConverterPool = elementConverterPool;
        this.dataConverterPool = dataConverterPool;

        this.convert = new Convert(this.elementConverterPool, this.dataConverterPool);

        this.bindUpdatePreviewObservablesOnChange();
    }


    /**
     * Retrieve the render template
     *
     * @returns {string}
     */
    get renderTemplate(): string {
        let template = appearanceConfig(this.parent.config.name, this.getData().appearance).render_template;
        if (undefined === template) {
            template = "Magento_PageBuilder/component/block/render/abstract.html";
        }
        return template;
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
     * Get data for css binding, example {"class-name": true}
     *
     * @returns {DataObject}
     */
    public getCss(element: string) {
        const result: object = {};
        let css: string = "";
        const data = this.parent.store.get(this.parent.id);
        if (element === undefined) {
            if ("css_classes" in data && data.css_classes !== "") {
                css = data.css_classes;
            }
        } else {
            const config = appearanceConfig(this.parent.config.name, data.appearance).data_mapping.elements[element];
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
        let data = _.extend({}, this.parent.store.get(this.parent.id), this.parent.config);
        if (element === undefined) {
            if (typeof data.appearance !== "undefined" &&
                typeof data.appearances !== "undefined" &&
                typeof data.appearances[data.appearance] !== "undefined") {
                _.extend(data, data.appearances[data.appearance]);
            }
            return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(data));
        }

        const appearanceConfiguration = appearanceConfig(this.parent.config.name, data.appearance);
        const config = appearanceConfiguration.data_mapping.elements;

        data = this.convert.convertData(data, appearanceConfiguration.data_mapping.converters);

        let result = {};
        if (config[element].style.length) {
            result = this.convert.convertStyle(config[element], data, "master");
        }
        return result;
    }

    /**
     * Get data for attr binding, example {"data-role": "element"}
     *
     * @returns {DataObject}
     */
    public getAttributes(element: string) {
        let data = _.extend({}, this.parent.store.get(this.parent.id), this.parent.config);
        if (element === undefined) {
            if (undefined === data.appearance || !data.appearance) {
                data.appearance = undefined !== this.parent.config.fields.appearance
                    ? this.parent.config.fields.appearance.default
                    : "default";
            }
            return this.attributeMapper.toDom(this.attributeFilter.filter(data));
        }

        const appearanceConfiguration = appearanceConfig(this.parent.config.name, data.appearance);
        const config = appearanceConfiguration.data_mapping.elements;

        data = this.convert.convertData(data, appearanceConfiguration.data_mapping.converters);

        let result = {};
        if (config[element].attributes.length) {
            result = this.convert.convertAttributes(config[element], data, "master");
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
        const data = this.parent.store.get(this.parent.id);
        const config = appearanceConfig(this.parent.config.name, data.appearance).data_mapping.elements[element];
        let result = "";
        if (undefined !== config.html.var) {
            result = this.convert.convertHtml(config, data, "master");
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
        let data = _.extend({}, this.parent.store.get(this.parent.id));

        if (undefined === element) {
            return data;
        }

        const appearanceConfiguration = appearanceConfig(this.parent.config.name, data.appearance);
        const config = appearanceConfiguration.data_mapping.elements;

        data = this.convert.convertData(data, appearanceConfiguration.data_mapping.converters);

        const result = {};
        if (undefined !== config[element].tag.var) {
            result[config[element].tag.var] = data[config[element].tag.var];
        }
        return result;
    }

    /**
     * Attach event to updating data in data store to update observables
     */
    private bindUpdatePreviewObservablesOnChange(): void {
        this.parent.store.subscribe(
            (data: DataObject) => {
                this.convert.updatePreviewObservables(
                    this,
                    _.extend({name: this.parent.config.name}, this.parent.store.get(this.parent.id)),
                    "master",
                );
            },
            this.parent.id,
        );
    }
}
