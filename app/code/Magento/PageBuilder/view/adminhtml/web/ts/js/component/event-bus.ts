/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";

class EventBus {
    private events: JQuery.PlainObject = $({});

    /**
     * Trigger an event and run callbacks
     *
     * @param {string} eventName, the name should be split with a semicolon as follows stage:mount
     * @param {{[p: string]: any}} params
     * @returns {any}
     */
    public trigger(eventName: string, params: {[key: string]: any}) {
        return this.events.trigger(eventName, params);
    }

    /**
     * Add a listener for an event
     *
     * @param {string} eventName
     * @param {() => void} handler
     * @returns {any}
     */
    public on(eventName: string, handler: (event: Event, params: {[key: string]: any}) => void) {
        return this.events.on(eventName, handler);
    }

    /**
     * Disable an event
     *
     * @param {string} eventName
     * @param {() => void} handler
     * @returns {any}
     */
    public off(eventName: string, handler: () => void) {
        return this.events.off(eventName, handler);
    }

    /**
     * Run an event callback once
     *
     * @param args
     */
    public once(...args: any[]) {
        return this.events.one.apply(this.events, args);
    }
}

export default new EventBus();
