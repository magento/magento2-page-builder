/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import ConfigInterface, {Mode} from "./config.types";
import ContentTypeConfigInterface from "./content-type-config.types";

export default class Config {
    /**
     * Set the initial config
     *
     * @param config
     */
    public static setConfig(config: ConfigInterface): void {
        Config.config = _.extend(Config.config, config);
    }

    /**
     * Set the current instances mode, this differs between preview or master depending on whether we're rendering the
     * admins preview or rendering the master format.
     *
     * @param {"Preview" | "Master"} mode
     */
    public static setMode(mode: Mode): void {
        Config.mode = mode;
    }

    /**
     * Retrieve the current instances mode
     */
    public static getMode(): Mode {
        return Config.mode;
    }

    /**
     * Retrieve the init config
     *
     * @param {string} key
     * @returns {T}
     */
    public static getConfig(key?: string) {
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
        bodyId: "html-body",
    };
    private static mode: Mode;
}
