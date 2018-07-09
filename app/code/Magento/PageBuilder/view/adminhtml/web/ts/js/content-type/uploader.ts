/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import layout from "uiLayout";
import registry from "uiRegistry";

/**
 * @api
 */
export default class Uploader {
    /**
     * Id of uploader instance
     */
    private id: string;

    /**
     * Name of uploader instance
     */
    private name: string;

    /**
     * Config data of uploader instance
     */
    private config: object;

    /**
     * @param {String} id
     * @param {String} name - Name to use for lookup reference in registry
     * @param {Object} config
     */
    constructor(id: string, name: string, config: object) {
        config.id = this.id = id;
        config.name = this.name = name;

        this.config = config;

        // Render uploader
        this.render();
    }

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Function}
     */
    public getUiComponent() {
        return registry.async(this.name);
    }

    /**
     * Register callback when file is uploaded through this instance
     *
     * @param {Function} callback - callback function containing array of file objects as argument
     */
    public onUploaded(callback: (files: object[]) => any) {
        events.on("image:" + this.id + ":uploadAfter", callback);
    }

    /**
     * Instantiate uploader through layout UI component renderer
     */
    private render() {
        layout([this.config]);
    }
}
