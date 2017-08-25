define(['exports', 'jquery'], function (exports, _jquery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var $ = _interopRequireWildcard(_jquery);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var EventEmitter = function () {
        function EventEmitter() {
            _classCallCheck(this, EventEmitter);

            this.events = $({});
        }
        /**
         * Trigger / emit an event
         */


        _createClass(EventEmitter, [{
            key: 'emit',
            value: function emit() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return this.events.trigger.apply(this.events, args);
            }
        }, {
            key: 'addListener',
            value: function addListener(eventName, handler) {
                return this.events.on(eventName, handler);
            }
        }, {
            key: 'on',
            value: function on() {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                return this.addListener.apply(this, args);
            }
        }, {
            key: 'removeListener',
            value: function removeListener(eventName, handler) {
                return this.events.off(eventName, handler);
            }
        }, {
            key: 'off',
            value: function off() {
                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                }

                return this.removeListener.apply(this, args);
            }
        }, {
            key: 'once',
            value: function once() {
                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = arguments[_key4];
                }

                return this.events.one.apply(this.events, args);
            }
        }]);

        return EventEmitter;
    }();

    exports.default = EventEmitter;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvZXZlbnQtZW1pdHRlci50cyJdLCJuYW1lcyI6WyIkIiwiRXZlbnRFbWl0dGVyIiwiZXZlbnRzIiwiYXJncyIsInRyaWdnZXIiLCJhcHBseSIsImV2ZW50TmFtZSIsImhhbmRsZXIiLCJvbiIsImFkZExpc3RlbmVyIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJvbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7UUFDWUEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU9FQyxZO0FBQWQsZ0NBQUE7QUFBQTs7QUFDWSxpQkFBQUMsTUFBQSxHQUE2QkYsRUFBRSxFQUFGLENBQTdCO0FBdUNYO0FBckNHOzs7Ozs7O21DQUdtQjtBQUFBLGtEQUFYRyxJQUFXO0FBQVhBLHdCQUFXO0FBQUE7O0FBQ2YsdUJBQU8sS0FBS0QsTUFBTCxDQUFZRSxPQUFaLENBQW9CQyxLQUFwQixDQUEwQixLQUFLSCxNQUEvQixFQUF1Q0MsSUFBdkMsQ0FBUDtBQUNIOzs7d0NBT1dHLFMsRUFBbUJDLE8sRUFBaUI7QUFDNUMsdUJBQU8sS0FBS0wsTUFBTCxDQUFZTSxFQUFaLENBQWVGLFNBQWYsRUFBMEJDLE9BQTFCLENBQVA7QUFDSDs7O2lDQUNnQjtBQUFBLG1EQUFYSixJQUFXO0FBQVhBLHdCQUFXO0FBQUE7O0FBQ2IsdUJBQU8sS0FBS00sV0FBTCxDQUFpQkosS0FBakIsQ0FBdUIsSUFBdkIsRUFBNkJGLElBQTdCLENBQVA7QUFDSDs7OzJDQU9jRyxTLEVBQW1CQyxPLEVBQWlCO0FBQy9DLHVCQUFPLEtBQUtMLE1BQUwsQ0FBWVEsR0FBWixDQUFnQkosU0FBaEIsRUFBMkJDLE9BQTNCLENBQVA7QUFDSDs7O2tDQUNpQjtBQUFBLG1EQUFYSixJQUFXO0FBQVhBLHdCQUFXO0FBQUE7O0FBQ2QsdUJBQU8sS0FBS1EsY0FBTCxDQUFvQk4sS0FBcEIsQ0FBMEIsSUFBMUIsRUFBZ0NGLElBQWhDLENBQVA7QUFDSDs7O21DQUtrQjtBQUFBLG1EQUFYQSxJQUFXO0FBQVhBLHdCQUFXO0FBQUE7O0FBQ2YsdUJBQU8sS0FBS0QsTUFBTCxDQUFZVSxHQUFaLENBQWdCUCxLQUFoQixDQUFzQixLQUFLSCxNQUEzQixFQUFtQ0MsSUFBbkMsQ0FBUDtBQUNIOzs7Ozs7c0JBdkNTRixZIiwiZmlsZSI6ImNvbXBvbmVudC9ldmVudC1lbWl0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVySW50ZXJmYWNlIH0gZnJvbSAnZXZlbnQtZW1pdHRlci5kJztcbmltcG9ydCAqIGFzICQgZnJvbSAnanF1ZXJ5JztcblxuLyoqXG4gKiBFdmVudEVtaXR0ZXIgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRFbWl0dGVyIGltcGxlbWVudHMgRXZlbnRFbWl0dGVySW50ZXJmYWNlIHtcbiAgICBwcml2YXRlIGV2ZW50czogSlF1ZXJ5LlBsYWluT2JqZWN0ID0gJCh7fSk7XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyIC8gZW1pdCBhbiBldmVudFxuICAgICAqL1xuICAgIGVtaXQoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzLnRyaWdnZXIuYXBwbHkodGhpcy5ldmVudHMsIGFyZ3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGxpc3RlbmVyIHRvIGFuIGV2ZW50XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGFkZExpc3RlbmVyKGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudHMub24oZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICB9XG4gICAgb24oLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSBhbiBldmVudFxuICAgICAqXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICByZW1vdmVMaXN0ZW5lcihldmVudE5hbWU6IHN0cmluZywgaGFuZGxlcjogRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9mZihldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIH1cbiAgICBvZmYoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIGFuIGV2ZW50IGNhbGxiYWNrIG9uY2VcbiAgICAgKi9cbiAgICBvbmNlKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbmUuYXBwbHkodGhpcy5ldmVudHMsIGFyZ3MpO1xuICAgIH1cbn0iXX0=
