/**
 * An event emitter that assumes the presence of jQuery, but follows the
 * increasingly standard EventEmitter API. Event-emitting code can use
 * this instead of depending on jQuery directly.
 */
define(['jquery'], function($) {

    /**
     * EventEmitter constructor
     *
     * @constructor
     */
    function EventEmitter() {
        this._events = $({});
    }

    /**
     * Trigger / emit an event
     *
     * @returns {*}
     */
    EventEmitter.prototype.emit = function() {
        return this._events.trigger.apply(this._events, arguments);
    };

    /**
     * Add a listener to a specific event
     *
     * @param eventName
     * @param handler
     * @returns {*}
     */
    EventEmitter.prototype.addListener = function(eventName, handler) {
        return this._events.on(eventName, handler);
    };

    /**
     * Add a listener to a specific event
     *
     * @returns {*}
     */
    EventEmitter.prototype.on = function() {
        return this.addListener.apply(this, arguments);
    };

    /**
     * Remove a listener
     *
     * @param eventName
     * @param handler
     * @returns {*}
     */
    EventEmitter.prototype.removeListener = function(eventName, handler) {
        return this._events.off(eventName, handler);
    };

    /**
     * Remove a listener
     *
     * @returns {*}
     */
    EventEmitter.prototype.off = function() {
        return this.removeListener.apply(this, arguments);
    };

    /**
     * Run an event callback once
     *
     * @returns {*}
     */
    EventEmitter.prototype.once = function() {
        return this._events.one.apply(this._events, arguments);
    };

    return EventEmitter;
});