/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import _ from "underscore";

export default class Config {

    /**
     * Set the initial config
     *
     * @param config
     */
    public static setConfig(config: object): void {
        Config.initConfig = config;
    }

    /**
     * Retrieve the init config
     *
     * @param key
     * @returns {any}
     */
    public static getConfig(key?: string): any {
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
    public static getContentTypeConfig(contentType: string): any {
        if (typeof Config.getConfig("content_types")[contentType] !== "undefined") {
            return Config.getConfig("content_types")[contentType];
        }

        return null;
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
        if (Config.getConfig(key)) {
            return Config.getConfig(key);
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

    private static initConfig: any;
    private static config: any = {
        dataRoleAttributeName: "data-role",
    };
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
    content_component: string;
    component: string;
    appearances: string[];
    readers: string[];
    allowed_parents: string[];
    is_visible: boolean;
}
export interface ConfigContentBlocks {
    [key: string]: ConfigContentBlock;
}
