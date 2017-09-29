import EventEmitter from "./event-emitter";
/**
 * DataStore Class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class DataStore extends EventEmitter {
    constructor() {
        super(...arguments);
        this.state = new Map;
        this.snapshotStorage = new Map;
        this.snapshotLog = [];
    }
    /**
     * Retrieve data from the state for an editable area
     *
     * @param id
     */
    get(id) {
        return this.state.get(id) || {};
    }
    /**
     * Update the state for an individual editable area
     *
     * @param id
     * @param data
     */
    update(id, data) {
        const previousState = this.state.get(id);
        if (previousState && previousState === data) {
            console.warn(`Warning: You updated ${id} with the same object as before. This will break the ability to rollback`);
        }
        this.state.set(id, data);
        // Append the previous state into our snapshot storage
        if (previousState) {
            let snapshots = this.snapshotStorage.get(id);
            if (!snapshots) {
                snapshots = [previousState];
                this.snapshotStorage.set(id, snapshots);
            }
            else {
                snapshots.unshift(previousState);
            }
            this.snapshotLog.push(id);
        }
        this.emitState(id, data);
    }
    /**
     * Update an individual key within an objects state
     *
     * @param id
     * @param data
     * @param key
     */
    updateKey(id, data, key) {
        let state = Object.assign({}, this.state.get(id)) || {};
        state[key] = data;
        this.update(id, state);
    }
    /**
     * Rollback an item to a previous state
     *
     * @param id
     */
    rollback(id) {
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
    remove(id) {
        this.state.delete(id);
        this.emitState(id, null);
    }
    /**
     * Subscribe to data changes on an editable area
     *
     * @param handler
     * @param id
     */
    subscribe(handler, id) {
        let eventName = (id ? 'state_' + id : 'state');
        this.on(eventName, (event, data) => {
            handler(data.state, event);
        });
    }
    /**
     * Emit state updates through events
     *
     * @param id
     * @param data
     */
    emitState(id, data) {
        this.emit('state', { state: this.state });
        if (id) {
            this.emit('state_' + id, { state: data });
        }
    }
}
