define(['exports', 'jquery'], function (exports, _jquery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var EventEmitter = function () {
        function EventEmitter() {
            _classCallCheck(this, EventEmitter);

            this.events = (0, _jquery2.default)({});
        }
        /**
         * Trigger / emit an event
         */


        EventEmitter.prototype.emit = function emit() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return this.events.trigger.apply(this.events, args);
        };

        EventEmitter.prototype.addListener = function addListener(eventName, handler) {
            return this.events.on(eventName, handler);
        };

        EventEmitter.prototype.on = function on() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return this.addListener.apply(this, args);
        };

        EventEmitter.prototype.removeListener = function removeListener(eventName, handler) {
            return this.events.off(eventName, handler);
        };

        EventEmitter.prototype.off = function off() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            return this.removeListener.apply(this, args);
        };

        EventEmitter.prototype.once = function once() {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            return this.events.one.apply(this.events, args);
        };

        return EventEmitter;
    }();

    exports.default = EventEmitter;
});