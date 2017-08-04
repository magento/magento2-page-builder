/// <reference path="../../../../../../node_modules/@types/jquery/index.d.ts" />
define(["require", "exports", "../../../../../../node_modules/jquery/dist/jquery"], function (require, exports, $) {
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
            return this.events.trigger.apply(this.events, arguments);
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
            return this.addListener.apply(this, arguments);
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
            return this.removeListener.apply(this, arguments);
        };
        /**
         * Run an event callback once
         */
        EventEmitter.prototype.once = function () {
            return this.events.one.apply(this.events, arguments);
        };
        return EventEmitter;
    }());
    exports.EventEmitter = EventEmitter;
});
//# sourceMappingURL=event-emitter.js.map