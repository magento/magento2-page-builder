/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { EventEmitterInterface } from "event-emitter.d";
import $ from "jquery";

export default class EventEmitter implements EventEmitterInterface {
    private events: JQuery.PlainObject = $({});

    /**
     * Trigger / emit an event
     */
    public emit(...args: any[]) {
        return this.events.trigger.apply(this.events, args);
    }

    /**
     * Add a listener to an event
     *
     * @returns {any}
     */
    public addListener(eventName: string, handler: () => void) {
        return this.events.on(eventName, handler);
    }
    public on(...args: any[]) {
        return this.addListener.apply(this, args);
    }

    /**
     * Remove a listener from an event
     *
     * @returns {any}
     */
    public removeListener(eventName: string, handler: () => void) {
        return this.events.off(eventName, handler);
    }
    public off(...args: any[]) {
        return this.removeListener.apply(this, args);
    }

    /**
     * Run an event callback once
     */
    public once(...args: any[]) {
        return this.events.one.apply(this.events, args);
    }
}
