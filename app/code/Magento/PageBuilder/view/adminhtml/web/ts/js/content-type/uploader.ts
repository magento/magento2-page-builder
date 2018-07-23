/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import layout from "uiLayout";
import registry from "uiRegistry";
import DataStore from "../data-store";

interface UploaderConfigInterface {
    id: string;
    name: string;
    dataScope: string|number;
    value: any;
}

/**
 * @api
 */
export default class Uploader {
    /**
     * Config data of uploader instance
     */
    private config: UploaderConfigInterface;

    /**
     * The supplied data store
     */
    private dataStore: DataStore;

    /**
     * @param {String} name Name to use for lookup reference in registry
     * @param {Object} uploaderConfig
     * @param {String} contentTypeId
     * @param {DataStore} dataStore
     * @param {Object[]} initialValue
     * @param {Function} onChangeCallback Called when image is added or updated
     * @param {Function} onDeleteCallback Called when currently set image is deleted from storage
     */
    constructor(
        name: string,
        uploaderConfig: object,
        contentTypeId: string,
        dataStore: DataStore,
        initialValue: string|any[],
        onChangeCallback: (data: object[]) => void = null,
        onDeleteCallback: () => void = null,
    ) {
        const config = (Object.assign({}, uploaderConfig, {
            value: initialValue,
        }) as UploaderConfigInterface);

        config.id = contentTypeId;
        config.name = name;
        this.dataStore = dataStore;

        events.on(
            "image:" + contentTypeId + ":uploadAfter",
            onChangeCallback ? onChangeCallback : this.onImageChanged.bind(this),
        );
        events.on(
            "image:" + contentTypeId + ":deleteFileAfter",
            onDeleteCallback ? onDeleteCallback : this.onImageDeleted.bind(this),
        );

        this.config = config;

        // Render uploader
        this.render();
    }

    /**
     * Default callback for upload event
     * @param {object[]} data
     */
    public onImageChanged(data: object[]) {
        this.dataStore.update(
            data,
            this.config.dataScope,
        );
    }

    /**
     * Default callback for image deleted event
     */
    public onImageDeleted() {
        this.dataStore.update(
            "",
            this.config.dataScope,
        );
    }

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Function}
     */
    public getUiComponent() {
        return registry.async(this.config.name);
    }

    /**
     * Instantiate uploader through layout UI component renderer
     */
    private render() {
        layout([this.config]);
    }
}
