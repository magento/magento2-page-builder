/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import {get, set} from "./utils/object";

interface DataStoreEvent {
    state: DataObject;
}

export interface DataObject<T = any> {
    [key: string]: T;
}

export default class DataStore {
    private state: DataObject = {};
    private events: JQuery = $({});
    private previousState: DataObject = {};

    /**
     * Retrieve specific data from the data store
     *
     * @param {string} key
     * @param defaultValue
     * @returns {T}
     */
    public get<T>(key: string, defaultValue?: any): T {
        return get(this.state, key, defaultValue);
    }

    /**
     * Retrieve the entire state of the data object
     *
     * @returns {DataObject}
     */
    public getState() {
        return this.state;
    }

    /**
     * Retrieve the entire previous state of the data object
     *
     * @returns {DataObject}
     */
    public getPreviousState() {
        return this.previousState;
    }

    /**
     * Set a specific keys value in the data store
     *
     * @param {string} key
     * @param value
     */
    public set(key: string, value: any) {
        this.previousState = Object.assign({}, this.state);
        set(this.state, key, value);
        this.emitState();
    }

    /**
     * Update the entire state for the content type
     *
     * @param {DataObject} state
     */
    public setState(state: DataObject) {
        this.previousState = Object.assign({}, this.state);
        this.state = state;
        this.emitState();
    }

    /**
     * Remove item from DataStore
     *
     * @param {string | number} key
     */
    public unset(key: string | number): void {
        const storeState = this.state;
        delete storeState[key];
        this.setState(storeState);
    }

    /**
     * Subscribe to data changes within the data store of a content type
     *
     * @param {(state: DataObject, event: Event) => void} handler
     * @param {string | number} key
     */
    public subscribe(handler: (state: DataObject, event: Event) => void, key?: string | number): void {
        this.events.on("state", (event: Event, data: DataStoreEvent) => {
            if (key) {
                if (this.previousState[key] !== data.state[key]) {
                    handler(data.state, event);
                }
            } else {
                if (this.previousState !== data.state) {
                    handler(data.state, event);
                }
            }
        });
    }

    /**
     * Emit state updates through events
     */
    private emitState() {
        this.events.trigger("state", { state: this.state });
    }
}
