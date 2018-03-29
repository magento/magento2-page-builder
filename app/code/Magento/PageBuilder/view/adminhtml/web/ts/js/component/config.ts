/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import cmsConfig from "advanced-cms-init-config";
import $ from "jquery";
import _ from "underscore";

export default class Config {

    /**
     * Set the initial config
     *
     * @param config
     */
    public static setInitConfig(config: object): void {
        Config.config = config;
    }

    /**
     * Retrieve the init config
     *
     * @param key
     * @returns {any}
     */
    public static getInitConfig(key?: string): any {
        if (key) {
            if (typeof Config.initConfig[key] !== "undefined") {
                return Config.initConfig[key];
            }
            return null;
        }
        return Config.initConfig;
    }

    /**
     * Retrieve a content type from the configuration
     *
     * @param {string} contentType
     * @returns {any}
     */
    public static getContentType(contentType: string): any {
        if (typeof Config.getInitConfig("content_types")[contentType] !== "undefined") {
            return Config.getInitConfig("content_types")[contentType];
        }

        return null;
    }

    /**
     * Retrieve the entire config
     *
     * @returns {any}
     */
    public static getConfig(): object {
        return Config.config;
    }

    /**
     * Get a specific value from the configuration based on a key
     *
     * @param key
     * @returns {any}
     */
    public static getValue(key: string): object | string | void {
        if (typeof Config.config[key] !== "undefined") {
            return Config.config[key];
        }
        if (Config.getInitConfig(key)) {
            return Config.getInitConfig(key);
        }
        return null;
    }

    /**
     * Retrieve a value as a string
     *
     * @param key
     * @returns {String}
     */
    public static getValueAsString(key: string): string {
        return String(Config.getValue(key));
    }

    /**
     * Delete a value from the configuration
     *
     * @param key
     * @param valueKey
     * @param value
     */
    public static deleteValue(key: string, valueKey: string, value: any): void {
        const arr: any[] = [];
        Config.config[key].forEach((item: any) => {
            if (item[valueKey] !== value) {
                arr.push(item);
            }
        });
        Config.config[key] = arr;
    }

    /**
     * Merge values into the configuration
     *
     * @param key
     * @param values
     */
    public static mergeValue(key: string, values: object): void {
        Config.config[key] = Config.config[key].concat(values);
    }

    /**
     * Update a value within a templates array
     *
     * @param matchKey
     * @param matchValue
     * @param newValueKey
     * @param newValue
     */
    public static updateTemplateValue(
        matchKey: string,
        matchValue: string,
        newValueKey: string | number,
        newValue: string,
    ) {
        const arr: any[] = [];
        Config.config.templates.forEach((item: any) => {
            if (item[matchKey] === matchValue) {
                item[newValueKey] = newValue;
            }
            arr.push(item);
        });
        Config.config.templates = arr;
    }

    /**
     * Retrieve a specific config value from the plugin section
     *
     * @param plugin
     * @param key
     * @returns {null}
     */
    public static getPluginConfig(plugin: string, key: string): object | null {
        const config = Config.initConfig;
        if (
            typeof config.plugins[plugin] !== "undefined" &&
            typeof config.plugins[plugin].config !== "undefined" &&
            typeof config.plugins[plugin].config[key] !== "undefined"
        ) {
            return config.plugins[plugin].config[key];
        }

        return null;
    }

    /**
     * Retrieve all fields stored in the configuration
     *
     * @returns {any}
     */
    public static getAllFields() {
        if (Config.allFields) {
            return Config.allFields;
        }

        Config.allFields = {};
        $.each(Config.initConfig.contentBlocks, (index, element) => {
            if (typeof element.fields === "object") {
                $.extend(Config.allFields, element.fields);
            }
        });

        // Include global fields in all fields
        if (this.getValue("globalFields")) {
            $.extend(Config.allFields, this.getValue("globalFields"));
        }

        return Config.allFields;
    }

    /**
     * Return an individual fields data
     *
     * @param key
     * @returns {any}
     */
    public static getField(key: string): object | null {
        let fields;
        if (!Config.allFields) {
            fields = Config.getAllFields();
        } else {
            fields = Config.allFields;
        }

        if (typeof fields[key] !== "undefined") {
            return fields[key];
        }

        return null;
    }

    /**
     * Reset the configuration
     */
    public static resetConfig(): void {
        Config.config = {};
    }

    /**
     * Retrieve the store ID
     *
     * @returns {any}
     */
    public static getStoreId() {
        if ($("#store_switcher").length > 0) {
            return $("#store_switcher").val();
        }
    }

    /**
     * Return a column definition based on the class name
     *
     * @param className
     * @returns {T}
     */
    public static getColumnDefinitionByClassName(className: string) {
        return Config.getColumnDef("className", className);
    }

    /**
     * Return a column definition based on a breakpoint
     *
     * @param breakpoint
     * @returns {T}
     */
    public static getColumnDefinitionByBreakpoint(breakpoint: number) {
        return Config.getColumnDef("breakpoint", breakpoint);
    }

    private static initConfig: any = cmsConfig;
    private static config: any = {
        dataRoleAttributeName: "data-role",
    };
    private static allFields: any;

    /**
     * Retrieve a column defination based on a key value pair
     *
     * @param field
     * @param value
     * @returns {undefined|T}
     */
    private static getColumnDef(field: string, value: string | number) {
        const searchObj: any = {};
        searchObj[field] = value;
        return _.findWhere(this.getInitConfig("column_definitions"), searchObj);
    }

}

export interface ConfigFieldConfig {
    [key: string]: {
        default: null | string | number;
    };
}
export interface ConfigContentBlock {
    name: string;
    label: string;
    icon: string;
    form: string;
    contentType: string;
    group: string;
    fields: ConfigFieldConfig;
    preview_template: string;
    render_template: string;
    preview_component: string;
    component: string;
    appearances: string[];
    readers: string[];
    allowed_parents: string[];
    is_visible: boolean;
}
export interface ConfigContentBlocks {
    [key: string]: ConfigContentBlock;
}
