/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import ContentTypeInterface from "../content-type.d";
import {DataObject} from "../data-store";
import AttributeFilter from "../master-format/attribute-filter";
import AttributeMapper from "../master-format/attribute-mapper";
import StyleAttributeFilter from "../master-format/style-attribute-filter";
import StyleAttributeMapper from "../master-format/style-attribute-mapper";
import appearanceConfig from "./appearance-config";
import ObservableObject from "./observable-object.d";
import ObservableUpdater from "./observable-updater";

/**
 * @api
 */
export default class Master {
    public data: ObservableObject = {};
    protected parent: ContentTypeInterface;
    private observableUpdater: ObservableUpdater;
    /**
     * @deprecated
     */
    private attributeFilter: AttributeFilter = new AttributeFilter();
    /**
     * @deprecated
     */
    private attributeMapper: AttributeMapper =  new AttributeMapper();
    /**
     * @deprecated
     */
    private styleAttributeFilter: StyleAttributeFilter = new StyleAttributeFilter();
    /**
     * @deprecated
     */
    private styleAttributeMapper: StyleAttributeMapper = new StyleAttributeMapper();

    /**
     * @param {ContentTypeInterface} parent
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ContentTypeInterface,
        observableUpdater: ObservableUpdater,
    ) {
        this.parent = parent;
        this.observableUpdater = observableUpdater;
        this.bindEvents();
    }

    /**
     * Retrieve the render template
     *
     * @returns {string}
     */
    get renderTemplate(): string {
        return appearanceConfig(this.parent.config.name, this.getData().appearance).render_template;
    }

    /**
     * Get data for css binding, example {"class-name": true}
     *
     * @returns {DataObject}
     * @deprecated
     */
    public getCss(element: string) {
        const result: object = {};
        let css: string = "";
        let data: DataObject = _.extend({}, this.parent.dataStore.get());
        if (element === undefined) {
            if ("css_classes" in data && data.css_classes !== "") {
                css = data.css_classes.toString();
            }
        } else {
            const appearanceConfiguration = appearanceConfig(
                this.parent.config.name,
                data.appearance,
            );
            const config = appearanceConfiguration.elements[element];

            if (config.css && config.css.var !== undefined && config.css.var in data ) {
                data = this.observableUpdater.convertData(data, appearanceConfiguration.converters);
                css = data[config.css.var].toString();
            }
        }
        if (css) {
            css.split(" ").map(
                (value: any, index: number) => result[value] = true,
            );
        }
        return result;
    }

    /**
     * Get data for style binding, example {"backgroundColor": "#cccccc"}
     *
     * @returns {DataObject}
     * @deprecated
     */
    public getStyle(element: string) {
        let data = _.extend({}, this.parent.dataStore.get(), this.parent.config);
        if (element === undefined) {
            if (typeof data.appearance !== "undefined" &&
                typeof data.appearances !== "undefined" &&
                typeof data.appearances[data.appearance] !== "undefined") {
                _.extend(data, data.appearances[data.appearance]);
            }
            return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(data));
        }

        const appearanceConfiguration = appearanceConfig(this.parent.config.name, data.appearance);
        const config = appearanceConfiguration.elements;

        data = this.observableUpdater.convertData(data, appearanceConfiguration.converters);

        let result = {};
        if (config[element].style.length) {
            result = this.observableUpdater.convertStyle(config[element], data, "master");
        }
        return result;
    }

    /**
     * Get data for attr binding, example {"data-role": "element"}
     *
     * @returns {DataObject}
     * @deprecated
     */
    public getAttributes(element: string) {
        let data = _.extend({}, this.parent.dataStore.get(), this.parent.config);
        if (element === undefined) {
            if (undefined === data.appearance || !data.appearance) {
                data.appearance = undefined !== this.parent.config.fields.appearance
                    ? this.parent.config.fields.appearance.default
                    : "default";
            }
            return this.attributeMapper.toDom(this.attributeFilter.filter(data));
        }

        const appearanceConfiguration = appearanceConfig(this.parent.config.name, data.appearance);
        const config = appearanceConfiguration.elements;

        data = this.observableUpdater.convertData(data, appearanceConfiguration.converters);

        let result = {};
        if (config[element].attributes.length) {
            result = this.observableUpdater.convertAttributes(config[element], data, "master");
        }

        return result;
    }

    /**
     * Get data for html binding
     *
     * @param {string} element
     * @returns {object}
     * @deprecated
     */
    public getHtml(element: string) {
        const data = this.parent.dataStore.get() as DataObject;
        const config = appearanceConfig(this.parent.config.name, data.appearance).elements[element];
        let result = "";
        if (undefined !== config.html.var) {
            result = this.observableUpdater.convertHtml(config, data, "master");
        }
        return result;
    }

    /**
     * Get content type data
     *
     * @param {string} element
     * @returns {DataObject}
     * @deprecated
     */
    public getData(element: string) {
        let data = _.extend({}, this.parent.dataStore.get());

        if (undefined === element) {
            return data;
        }

        const appearanceConfiguration = appearanceConfig(this.parent.config.name, data.appearance);
        const config = appearanceConfiguration.elements;

        data = this.observableUpdater.convertData(data, appearanceConfiguration.converters);

        const result = {};
        if (undefined !== config[element].tag.var) {
            result[config[element].tag.var] = data[config[element].tag.var];
        }
        return result;
    }

    /**
     * Attach event to updating data in data store to update observables
     */
    protected bindEvents(): void {
        this.parent.dataStore.subscribe(
            (data: DataObject) => {
                this.updateObservables();
            },
        );
    }

    /**
     * After observables updated, allows to modify observables
     */
    protected afterObservablesUpdated(): void {
        return;
    }

    /**
     * Update observables
     */
    private updateObservables(): void {
        this.observableUpdater.update(
            this,
            _.extend({name: this.parent.config.name}, this.parent.dataStore.get()),
        );
        this.afterObservablesUpdated();
    }
}
