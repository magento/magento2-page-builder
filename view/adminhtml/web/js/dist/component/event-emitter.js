define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * EventEmitter class
     *
     * @author Dave Macaulay <dmacaulay@magento.com>
     */
    var EventEmitter = (function () {
        function EventEmitter() {
            this.events = $({});
        }
        /**
         * Trigger / emit an event
         */
        EventEmitter.prototype.emit = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return this.events.trigger.apply(this.events, args);
        };
        /**
         * Add a listener to an event
         *
         * @returns {any}
         */
        EventEmitter.prototype.addListener = function (eventName, handler) {
            return this.events.on(eventName, handler);
        };
        EventEmitter.prototype.on = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return this.addListener.apply(this, args);
        };
        /**
         * Remove a listener from an event
         *
         * @returns {any}
         */
        EventEmitter.prototype.removeListener = function (eventName, handler) {
            return this.events.off(eventName, handler);
        };
        EventEmitter.prototype.off = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return this.removeListener.apply(this, args);
        };
        /**
         * Run an event callback once
         */
        EventEmitter.prototype.once = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return this.events.one.apply(this.events, args);
        };
        return EventEmitter;
    }());
    exports.EventEmitter = EventEmitter;
});
//# sourceMappingURL=event-emitter.js.map