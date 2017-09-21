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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ldmVudC1lbWl0dGVyLnRzIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsImV2ZW50cyIsImVtaXQiLCJhcmdzIiwidHJpZ2dlciIsImFwcGx5IiwiYWRkTGlzdGVuZXIiLCJldmVudE5hbWUiLCJoYW5kbGVyIiwib24iLCJyZW1vdmVMaXN0ZW5lciIsIm9mZiIsIm9uY2UiLCJvbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQVFjQSxZO0FBQWQsZ0NBQUE7QUFBQTs7QUFDWSxpQkFBQUMsTUFBQSxHQUE2QixzQkFBTyxFQUFQLENBQTdCO0FBdUNYO0FBckNHOzs7OzsrQkFHQUMsSSxtQkFBbUI7QUFBQSw4Q0FBWEMsSUFBVztBQUFYQSxvQkFBVztBQUFBOztBQUNmLG1CQUFPLEtBQUtGLE1BQUwsQ0FBWUcsT0FBWixDQUFvQkMsS0FBcEIsQ0FBMEIsS0FBS0osTUFBL0IsRUFBdUNFLElBQXZDLENBQVA7QUFDSCxTOzsrQkFPREcsVyx3QkFBWUMsUyxFQUFtQkMsTyxFQUFpQjtBQUM1QyxtQkFBTyxLQUFLUCxNQUFMLENBQVlRLEVBQVosQ0FBZUYsU0FBZixFQUEwQkMsT0FBMUIsQ0FBUDtBQUNILFM7OytCQUNEQyxFLGlCQUFpQjtBQUFBLCtDQUFYTixJQUFXO0FBQVhBLG9CQUFXO0FBQUE7O0FBQ2IsbUJBQU8sS0FBS0csV0FBTCxDQUFpQkQsS0FBakIsQ0FBdUIsSUFBdkIsRUFBNkJGLElBQTdCLENBQVA7QUFDSCxTOzsrQkFPRE8sYywyQkFBZUgsUyxFQUFtQkMsTyxFQUFpQjtBQUMvQyxtQkFBTyxLQUFLUCxNQUFMLENBQVlVLEdBQVosQ0FBZ0JKLFNBQWhCLEVBQTJCQyxPQUEzQixDQUFQO0FBQ0gsUzs7K0JBQ0RHLEcsa0JBQWtCO0FBQUEsK0NBQVhSLElBQVc7QUFBWEEsb0JBQVc7QUFBQTs7QUFDZCxtQkFBTyxLQUFLTyxjQUFMLENBQW9CTCxLQUFwQixDQUEwQixJQUExQixFQUFnQ0YsSUFBaEMsQ0FBUDtBQUNILFM7OytCQUtEUyxJLG1CQUFtQjtBQUFBLCtDQUFYVCxJQUFXO0FBQVhBLG9CQUFXO0FBQUE7O0FBQ2YsbUJBQU8sS0FBS0YsTUFBTCxDQUFZWSxHQUFaLENBQWdCUixLQUFoQixDQUFzQixLQUFLSixNQUEzQixFQUFtQ0UsSUFBbkMsQ0FBUDtBQUNILFM7Ozs7O3NCQXZDU0gsWSIsImZpbGUiOiJjb21wb25lbnQvZXZlbnQtZW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlckludGVyZmFjZSB9IGZyb20gJ2V2ZW50LWVtaXR0ZXIuZCc7XG5pbXBvcnQgalF1ZXJ5IGZyb20gJ2pxdWVyeSc7XG5cbi8qKlxuICogRXZlbnRFbWl0dGVyIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50RW1pdHRlciBpbXBsZW1lbnRzIEV2ZW50RW1pdHRlckludGVyZmFjZSB7XG4gICAgcHJpdmF0ZSBldmVudHM6IEpRdWVyeS5QbGFpbk9iamVjdCA9IGpRdWVyeSh7fSk7XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyIC8gZW1pdCBhbiBldmVudFxuICAgICAqL1xuICAgIGVtaXQoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzLnRyaWdnZXIuYXBwbHkodGhpcy5ldmVudHMsIGFyZ3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGxpc3RlbmVyIHRvIGFuIGV2ZW50XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGFkZExpc3RlbmVyKGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudHMub24oZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICB9XG4gICAgb24oLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSBhbiBldmVudFxuICAgICAqXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICByZW1vdmVMaXN0ZW5lcihldmVudE5hbWU6IHN0cmluZywgaGFuZGxlcjogRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9mZihldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIH1cbiAgICBvZmYoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIGFuIGV2ZW50IGNhbGxiYWNrIG9uY2VcbiAgICAgKi9cbiAgICBvbmNlKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbmUuYXBwbHkodGhpcy5ldmVudHMsIGFyZ3MpO1xuICAgIH1cbn0iXX0=
