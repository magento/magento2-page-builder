import EventEmitter from "./event-emitter";
import EditableArea from "./stage/structural/editable-area";
import _ from "underscore";

interface DataStoreEvent {
    state: State
}

interface State {
    state: object | null
}

export interface DataObject {
    // State object can only contain primitives
    [key: string]: undefined | null | string | number | boolean;
}

/**
 * DataStore Class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class DataStore extends EventEmitter {
    state: Map<string, DataObject> = new Map;
    snapshotStorage: Map<string, Array<DataObject>> = new Map;
    snapshotLog: Array<string> = [];

    /**
     * Retrieve data from the state for an editable area
     * 
     * @param id 
     */
    get(id: string): DataObject {
        return this.state.get(id) || {};
    }

    /**
     * Update the state for an individual editable area
     * 
     * @param id 
     * @param data 
     */
    update(id: string, data: DataObject): void {
        const previousState = this.state.get(id);
        if (previousState && previousState === data) {
            console.warn(`Warning: You updated ${id} with the same object as before. This will break the ability to rollback`);
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
        console.log('data-store:update')
    }

    /**
     * Update an individual key within an objects state
     * 
     * @param id 
     * @param data 
     * @param key 
     */
    updateKey(id: string, data: undefined | null | string | number | boolean, key?: string | number) {
        let state = Object.assign({}, this.state.get(id)) || {};
        state[key] = data;
        this.update(id, state);
    }

    /**
     * Rollback an item to a previous state
     * 
     * @param id 
     */
    rollback(id?: string) {
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
    remove(id: string): void {
        this.state.delete(id);

        this.emitState(id, null);
    }

    /**
     * Subscribe to data changes on an editable area
     * 
     * @param handler 
     * @param id 
     */
    subscribe(handler: Function, id?: string): void {
        let eventName = (id ? 'state_' + id : 'state');
        this.on(eventName, (event: Event, data: DataStoreEvent) => {
            handler(data.state, event);
        });
        console.log('data-store:subscribe')
    }

    /**
     * Emit state updates through events 
     * 
     * @param id
     * @param data 
     */
    private emitState(id?: string, data?: any) {
        this.emit('state', { state: this.state });
        if (id) {
            this.emit('state_' + id, { state: data });
        }
    }
}