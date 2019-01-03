/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import ContentTypeInterface from "../content-type.d";
import {DataObject} from "../data-store";
import appearanceConfig from "./appearance-config";
import ObservableObject from "./observable-object.d";
import ObservableUpdater from "./observable-updater";

/**
 * @api
 */
export default class Master {
    public data: ObservableObject = {};
    public parent: ContentTypeInterface;
    private observableUpdater: ObservableUpdater;

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
        return appearanceConfig(this.parent.config.name, this.getData().appearance as string).render_template;
    }

    /**
     * Get content type data
     *
     * @param {string} element
     * @returns {DataObject}
     * @deprecated
     */
    public getData(element?: string): DataObject {
        let data = _.extend({}, this.parent.dataStore.get());

        if (undefined === element) {
            return data;
        }

        const appearanceConfiguration = appearanceConfig(this.parent.config.name, data.appearance);
        const config = appearanceConfiguration.elements;

        data = this.observableUpdater.convertData(data, appearanceConfiguration.converters);

        const result: {[key: string]: string} = {};
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
