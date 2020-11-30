/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import Config from "../config";
import ContentTypeInterface from "../content-type.types";
import DataStore, {DataObject} from "../data-store";
import {get} from "../utils/object";
import appearanceConfig from "./appearance-config";
import ObservableUpdater from "./observable-updater";
import ObservableObject, {GeneratedElementsData} from "./observable-updater.types";

/**
 * @api
 */
export default class Master {
    public data: ObservableObject = {};
    public contentType: ContentTypeInterface;
    private observableUpdater: ObservableUpdater;

    /**
     * @param {ContentTypeInterface} contentType
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        contentType: ContentTypeInterface,
        observableUpdater: ObservableUpdater,
    ) {
        this.contentType = contentType;
        this.observableUpdater = observableUpdater;
        this.bindEvents();
    }

    /**
     * Retrieve the render template
     *
     * @returns {string}
     */
    get template(): string {
        return appearanceConfig(this.contentType.config.name, this.getData().appearance as string)
            .master_template;
    }

    /**
     * Get content type data
     *
     * @param {string} element
     * @returns {DataObject}
     * @deprecated
     */
    public getData(element?: string): DataObject {
        let data = _.extend({}, this.contentType.dataStore.getState());

        if (undefined === element) {
            return data;
        }

        const appearanceConfiguration = appearanceConfig(this.contentType.config.name, data.appearance);
        const config = appearanceConfiguration.elements;

        data = this.observableUpdater.convertData(data, appearanceConfiguration.converters);

        const result: {[key: string]: string} = {};
        if (undefined !== config[element].tag.var) {
            result[config[element].tag.var] = get(data, config[element].tag.var);
        }
        return result;
    }

    /**
     * Destroys current instance
     */
    public destroy(): void {
        return;
    }

    /**
     * Attach event to updating data in data store to update observables
     */
    protected bindEvents(): void {
        this.contentType.dataStore.subscribe(
            () => {
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
     *
     * @deprecated
     */
    private updateObservables(): void {
        this.observableUpdater.update(
            this,
            _.extend({name: this.contentType.config.name}, this.contentType.dataStore.getState()),
            this.contentType.getDataStoresStates(),
        );
        this.afterObservablesUpdated();
    }
}
