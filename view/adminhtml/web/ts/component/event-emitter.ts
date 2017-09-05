import { EventEmitterInterface } from 'event-emitter.d';
import * as $ from 'jquery';

/**
 * EventEmitter class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class EventEmitter implements EventEmitterInterface {
    private events: JQuery.PlainObject = $({});

    /**
     * Trigger / emit an event
     */
    emit(...args: any[]) {
        return this.events.trigger.apply(this.events, args);
    }

    /**
     * Add a listener to an event
     *
     * @returns {any}
     */
    addListener(eventName: string, handler: Function) {
        return this.events.on(eventName, handler);
    }
    on(...args: any[]) {
        return this.addListener.apply(this, args);
    }

    /**
     * Remove a listener from an event
     *
     * @returns {any}
     */
    removeListener(eventName: string, handler: Function) {
        return this.events.off(eventName, handler);
    }
    off(...args: any[]) {
        return this.removeListener.apply(this, args);
    }

    /**
     * Run an event callback once
     */
    once(...args: any[]) {
        return this.events.one.apply(this.events, args);
    }
}