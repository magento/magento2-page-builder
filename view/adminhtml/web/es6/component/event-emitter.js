import jQuery from 'jquery';
/**
 * EventEmitter class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class EventEmitter {
    constructor() {
        this.events = jQuery({});
    }
    /**
     * Trigger / emit an event
     */
    emit(...args) {
        return this.events.trigger.apply(this.events, args);
    }
    /**
     * Add a listener to an event
     *
     * @returns {any}
     */
    addListener(eventName, handler) {
        return this.events.on(eventName, handler);
    }
    on(...args) {
        return this.addListener.apply(this, args);
    }
    /**
     * Remove a listener from an event
     *
     * @returns {any}
     */
    removeListener(eventName, handler) {
        return this.events.off(eventName, handler);
    }
    off(...args) {
        return this.removeListener.apply(this, args);
    }
    /**
     * Run an event callback once
     */
    once(...args) {
        return this.events.one.apply(this.events, args);
    }
}
