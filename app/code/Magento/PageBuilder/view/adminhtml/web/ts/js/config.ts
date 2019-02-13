/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import ContentTypeConfigInterface from "./content-type-config.types";

export default class Config {

    /**
     * Set the initial config
     *
     * @param config
     */
    public static setConfig(config: object): void {
        Config.config = _.extend(Config.config, config);
    }

    /**
     * Retrieve the init config
     *
     * @param {string} key
     * @returns {T}
     */
    public static getConfig<T = any>(key?: string): T {
        if (key) {
            if (typeof Config.config[key] !== "undefined") {
                return Config.config[key];
            }
            return null;
        }
        return Config.config;
    }

    /**
     * Retrieve a content type from the configuration
     *
     * @param {string} contentType
     * @returns {any}
     */
    public static getContentTypeConfig(contentType: string): ContentTypeConfigInterface {
        if (typeof Config.getConfig("content_types")[contentType] !== "undefined") {
            return Config.getConfig("content_types")[contentType];
        }

        return null;
    }

    private static config: any = {
        dataContentTypeAttributeName: "data-content-type",
    };
}
