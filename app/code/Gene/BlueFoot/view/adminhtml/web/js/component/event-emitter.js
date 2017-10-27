define(["jquery"], function (_jquery) {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * EventEmitter class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var EventEmitter =
  /*#__PURE__*/
  function () {
    function EventEmitter() {
      _classCallCheck(this, EventEmitter);

      this.events = (0, _jquery)({});
    }

    _createClass(EventEmitter, [{
      key: "emit",

      /**
       * Trigger / emit an event
       */
      value: function emit() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return this.events.trigger.apply(this.events, args);
      }
      /**
       * Add a listener to an event
       *
       * @returns {any}
       */

    }, {
      key: "addListener",
      value: function addListener(eventName, handler) {
        return this.events.on(eventName, handler);
      }
    }, {
      key: "on",
      value: function on() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return this.addListener.apply(this, args);
      }
      /**
       * Remove a listener from an event
       *
       * @returns {any}
       */

    }, {
      key: "removeListener",
      value: function removeListener(eventName, handler) {
        return this.events.off(eventName, handler);
      }
    }, {
      key: "off",
      value: function off() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return this.removeListener.apply(this, args);
      }
      /**
       * Run an event callback once
       */

    }, {
      key: "once",
      value: function once() {
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        return this.events.one.apply(this.events, args);
      }
    }]);

    return EventEmitter;
  }();

  return EventEmitter;
});
//# sourceMappingURL=event-emitter.js.map
