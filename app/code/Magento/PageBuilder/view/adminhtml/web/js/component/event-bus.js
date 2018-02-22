/*eslint-disable */
define(["jquery"], function (_jquery) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var EventBus =
  /*#__PURE__*/
  function () {
    function EventBus() {
      this.events = (0, _jquery)({});
    }

    var _proto = EventBus.prototype;

    /**
     * Trigger an event and run callbacks
     *
     * @param {string} eventName, the name should be split with a semicolon as follows stage:mount
     * @param {{[p: string]: any}} params
     * @returns {any}
     */
    _proto.trigger = function trigger(eventName, params) {
      return this.events.trigger(eventName, params);
    };
    /**
     * Add a listener for an event
     *
     * @param {string} eventName
     * @param {() => void} handler
     * @returns {any}
     */


    _proto.on = function on(eventName, handler) {
      return this.events.on(eventName, handler);
    };
    /**
     * Disable an event
     *
     * @param {string} eventName
     * @param {() => void} handler
     * @returns {any}
     */


    _proto.off = function off(eventName, handler) {
      return this.events.off(eventName, handler);
    };
    /**
     * Run an event callback once
     *
     * @param args
     */


    _proto.once = function once() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.events.one.apply(this.events, args);
    };

    return EventBus;
  }();

  var _default = new EventBus();

  return _default;
});
//# sourceMappingURL=event-bus.js.map
