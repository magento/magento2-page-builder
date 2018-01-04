define(["jquery"], function (_jquery) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /*eslint-disable */
  var EventEmitter =
  /*#__PURE__*/
  function () {
    function EventEmitter() {
      this.events = (0, _jquery)({});
    }

    var _proto = EventEmitter.prototype;

    /**
     * Trigger / emit an event
     */
    _proto.emit = function emit() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.events.trigger.apply(this.events, args);
    };
    /**
     * Add a listener to an event
     *
     * @returns {any}
     */


    _proto.addListener = function addListener(eventName, handler) {
      return this.events.on(eventName, handler);
    };

    _proto.on = function on() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.addListener.apply(this, args);
    };
    /**
     * Remove a listener from an event
     *
     * @returns {any}
     */


    _proto.removeListener = function removeListener(eventName, handler) {
      return this.events.off(eventName, handler);
    };

    _proto.off = function off() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.removeListener.apply(this, args);
    };
    /**
     * Run an event callback once
     */


    _proto.once = function once() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return this.events.one.apply(this.events, args);
    };

    return EventEmitter;
  }();

  return EventEmitter;
});
//# sourceMappingURL=event-emitter.js.map
