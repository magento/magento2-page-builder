/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import {get} from "./utils/object";

interface DataStoreEvent {
    state: DataObject;
}

export interface DataObject {
    // State object can only contain primitives
    [key: string]: undefined | null | string | number | boolean | any[];
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
     * Update the state for the content type
     *
     * @param {DataObject | string | number | boolean | any[] | null | undefined} data
     * @param {string | number} key
     */
    public update(
        data: DataObject | undefined | null | string | number | boolean | any[],
        key?: string | number,
    ): void {
        this.previousState = Object.assign({}, this.state);
        if (key) {
            this.state[key] = (data as undefined | null | string | number | boolean | any[]);
        } else {
            this.state = (data as DataObject);
        }
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
        this.update(storeState);
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
