/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';
import $ from 'jquery';
import cmsConfig from 'advanced-cms-init-config';

export default class Config {
    private static initConfig: any = cmsConfig;
    private static config: any = {
        'dataRoleAttributeName': 'data-role'
    };
    private static allFields: any;

    /**
     * Set the initial config
     *
     * @param config
     */
    static setInitConfig(config: object): void {
        Config.config = config;
    }

    /**
     * Retrieve the init config
     *
     * @param key
     * @returns {any}
     */
    static getInitConfig(key?: string): any {
        if (key) {
            if (typeof Config.initConfig[key] !== 'undefined') {
                return Config.initConfig[key];
            }
            return null;
        }
        return Config.initConfig;
    }

    /**
     * Return a content types configuration from the config
     *
     * @param type
     * @returns {any}
     */
    static getContentBlockConfig(type: string): object {
        if (typeof Config.initConfig.contentBlocks === 'object' && typeof Config.initConfig.contentBlocks[type] === 'object') {
            return Config.initConfig.contentBlocks[type];
        }

        return {};
    }

    /**
     * Retrieve the entire config
     *
     * @returns {any}
     */
    static getConfig(): object {
        return Config.config;
    }

    /**
     * Get a specific value from the configuration based on a key
     *
     * @param key
     * @returns {any}
     */
    static getValue(key: string): object | string | void {
        if (typeof Config.config[key] !== 'undefined') {
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
    static getValueAsString(key: string): string {
        return String(Config.getValue(key));
    }

    /**
     * Delete a value from the configuration
     *
     * @param key
     * @param valueKey
     * @param value
     */
    static deleteValue(key: string, valueKey: string, value: any): void {
        let arr: Array<any> = [];
        Config.config[key].forEach(function (item: any) {
            if (item[valueKey] != value) {
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
    static mergeValue(key: string, values: object): void {
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
    static updateTemplateValue(matchKey: string, matchValue: string, newValueKey: string | number, newValue: string) {
        let arr: Array<any> = [];
        Config.config['templates'].forEach(function (item: any) {
            if (item[matchKey] === matchValue) {
                item[newValueKey] = newValue;
            }
            arr.push(item);
        });
        Config.config['templates'] = arr;
    }

    /**
     * Retrieve a specific config value from the plugin section
     *
     * @param plugin
     * @param key
     * @returns {null}
     */
    static getPluginConfig(plugin: string, key: string): object | null {
        let config = Config.initConfig;
        if (typeof config.plugins[plugin] !== 'undefined' && typeof config.plugins[plugin]['config'] !== 'undefined' && typeof config.plugins[plugin]['config'][key] !== 'undefined') {
            return config.plugins[plugin]['config'][key];
        }

        return null;
    }

    /**
     * Retrieve all fields stored in the configuration
     *
     * @returns {any}
     */
    static getAllFields() {
        if (Config.allFields) {
            return Config.allFields;
        }

        Config.allFields = {};
        $.each(Config.initConfig.contentBlocks, function (index, element) {
            if (typeof element.fields === 'object') {
                $.extend(Config.allFields, element.fields);
            }
        });

        // Include global fields in all fields
        if (this.getValue('globalFields')) {
            $.extend(Config.allFields, this.getValue('globalFields'));
        }

        return Config.allFields;
    }

    /**
     * Return an individual fields data
     *
     * @param key
     * @returns {any}
     */
    static getField(key: string): object | null {
        let fields;
        if (!Config.allFields) {
            fields = Config.getAllFields();
        } else {
            fields = Config.allFields;
        }

        if (typeof fields[key] !== 'undefined') {
            return fields[key];
        }

        return null;
    }

    /**
     * Reset the configuration
     */
    static resetConfig(): void {
        Config.config = {};
    }

    /**
     * Retrieve the store ID
     *
     * @returns {any}
     */
    static getStoreId() {
        if ($('#store_switcher').length > 0) {
            return $('#store_switcher').val();
        }
    }

    /**
     * Return a column definition based on the class name
     *
     * @param className
     * @returns {T}
     */
    static getColumnDefinitionByClassName(className: string) {
        return Config.getColumnDef('className', className);
    }

    /**
     * Return a column definition based on a breakpoint
     *
     * @param breakpoint
     * @returns {T}
     */
    static getColumnDefinitionByBreakpoint(breakpoint: number) {
        return Config.getColumnDef('breakpoint', breakpoint);
    }

    /**
     * Retrieve a column defination based on a key value pair
     *
     * @param field
     * @param value
     * @returns {undefined|T}
     */
    private static getColumnDef(field: string, value: string | number) {
        let searchObj: any = {};
        searchObj[field] = value;
        return _.findWhere(this.getInitConfig('column_definitions'), searchObj);
    }
}

export interface ConfigFieldConfig {
    default: null | string | number;
}
export interface ConfigContentBlock {
    name: string;
    label: string;
    icon: string;
    form: string;
    contentType: string;
    group: string;
    fields: Array<ConfigFieldConfig>;
    visible: boolean;
    preview_template: string;
    render_template: string;
    preview_component: string;
    component: string;
}
export interface ConfigContentBlocks {
    [key: string]: ConfigContentBlock
}