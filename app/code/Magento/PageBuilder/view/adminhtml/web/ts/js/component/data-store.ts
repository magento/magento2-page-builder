/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";

interface DataStoreEvent {
    state: DataObject;
}

export interface DataObject {
    // State object can only contain primitives
    [key: string]: undefined | null | string | number | boolean | any[];
}

export default class DataStore {
    private state: Map<string, DataObject> = new Map();
    private snapshotStorage: Map<string, DataObject[]> = new Map();
    private snapshotLog: string[] = [];
    private events: JQuery.PlainObject = $({});

    /**
     * Retrieve data from the state for an editable area
     *
     * @param id
     */
    public get(id: string): DataObject {
        return this.state.get(id) || {};
    }

    /**
     * Update the state for an individual editable area
     *
     * @param id
     * @param data
     */
    public update(id: string, data: DataObject): void {
        const previousState = this.state.get(id);
        if (previousState && previousState === data) {
            console.warn(
                `Warning: You updated ${id} with the same object as before.` +
                `This will break the ability to rollback`,
            );
        }
        const storeData = Object.assign({}, data);
        this.state.set(id, storeData);

        // Append the previous state into our snapshot storage
        if (previousState) {
            let snapshots = this.snapshotStorage.get(id);
            if (!snapshots) {
                snapshots = [previousState];
                this.snapshotStorage.set(id, snapshots);
            } else {
                snapshots.unshift(previousState);
            }
            this.snapshotLog.push(id);
        }

        this.emitState(id, storeData);
    }

    /**
     * Update an individual key within an objects state
     *
     * @param id
     * @param data
     * @param key
     */
    public updateKey(id: string, data: undefined | null | string | number | boolean, key?: string | number) {
        const state = Object.assign({}, this.state.get(id)) || {};
        state[key] = data;
        this.update(id, state);
    }

    /**
     * Rollback an item to a previous state
     *
     * @param id
     */
    public rollback(id?: string) {
        id = id || this.snapshotLog.shift();
        const lastState = this.snapshotStorage.get(id);
        if (lastState) {
            const data = lastState.shift();
            this.state.set(id, data);
            this.emitState(id, data);
        }
     }

    /**
     * Remove an object from the state
     *
     * @param id
     */
    public remove(id: string): void {
        this.state.delete(id);
        this.emitState(id, null);
    }

    /**
     * Subscribe to data changes on an editable area
     *
     * @param {(state: DataObject, event: Event) => void} handler
     * @param {string} id
     */
    public subscribe(handler: (state: DataObject, event: Event) => void, id?: string): void {
        const eventName = (id ? "state_" + id : "state");
        this.events.on(eventName, (event: Event, data: DataStoreEvent) => {
            handler(data.state, event);
        });
    }

    /**
     * Emit state updates through events
     *
     * @param id
     * @param data
     */
    private emitState(id?: string, data?: any) {
        this.events.trigger("state", { state: this.state });
        if (id) {
            this.events.trigger("state_" + id, { state: data });
        }
    }
}
