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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ldmVudC1lbWl0dGVyLnRzIl0sIm5hbWVzIjpbIiQiLCJFdmVudEVtaXR0ZXIiLCJldmVudHMiLCJhcmdzIiwidHJpZ2dlciIsImFwcGx5IiwiZXZlbnROYW1lIiwiaGFuZGxlciIsIm9uIiwiYWRkTGlzdGVuZXIiLCJvZmYiLCJyZW1vdmVMaXN0ZW5lciIsIm9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztRQUNZQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBT0VDLFk7QUFBZCxnQ0FBQTtBQUFBOztBQUNZLGlCQUFBQyxNQUFBLEdBQTZCRixFQUFFLEVBQUYsQ0FBN0I7QUF1Q1g7QUFyQ0c7Ozs7Ozs7bUNBR21CO0FBQUEsa0RBQVhHLElBQVc7QUFBWEEsd0JBQVc7QUFBQTs7QUFDZix1QkFBTyxLQUFLRCxNQUFMLENBQVlFLE9BQVosQ0FBb0JDLEtBQXBCLENBQTBCLEtBQUtILE1BQS9CLEVBQXVDQyxJQUF2QyxDQUFQO0FBQ0g7Ozt3Q0FPV0csUyxFQUFtQkMsTyxFQUFpQjtBQUM1Qyx1QkFBTyxLQUFLTCxNQUFMLENBQVlNLEVBQVosQ0FBZUYsU0FBZixFQUEwQkMsT0FBMUIsQ0FBUDtBQUNIOzs7aUNBQ2dCO0FBQUEsbURBQVhKLElBQVc7QUFBWEEsd0JBQVc7QUFBQTs7QUFDYix1QkFBTyxLQUFLTSxXQUFMLENBQWlCSixLQUFqQixDQUF1QixJQUF2QixFQUE2QkYsSUFBN0IsQ0FBUDtBQUNIOzs7MkNBT2NHLFMsRUFBbUJDLE8sRUFBaUI7QUFDL0MsdUJBQU8sS0FBS0wsTUFBTCxDQUFZUSxHQUFaLENBQWdCSixTQUFoQixFQUEyQkMsT0FBM0IsQ0FBUDtBQUNIOzs7a0NBQ2lCO0FBQUEsbURBQVhKLElBQVc7QUFBWEEsd0JBQVc7QUFBQTs7QUFDZCx1QkFBTyxLQUFLUSxjQUFMLENBQW9CTixLQUFwQixDQUEwQixJQUExQixFQUFnQ0YsSUFBaEMsQ0FBUDtBQUNIOzs7bUNBS2tCO0FBQUEsbURBQVhBLElBQVc7QUFBWEEsd0JBQVc7QUFBQTs7QUFDZix1QkFBTyxLQUFLRCxNQUFMLENBQVlVLEdBQVosQ0FBZ0JQLEtBQWhCLENBQXNCLEtBQUtILE1BQTNCLEVBQW1DQyxJQUFuQyxDQUFQO0FBQ0g7Ozs7OztzQkF2Q1NGLFkiLCJmaWxlIjoiY29tcG9uZW50L2V2ZW50LWVtaXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXJJbnRlcmZhY2UgfSBmcm9tICdldmVudC1lbWl0dGVyLmQnO1xuaW1wb3J0ICogYXMgJCBmcm9tICdqcXVlcnknO1xuXG4vKipcbiAqIEV2ZW50RW1pdHRlciBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEVtaXR0ZXIgaW1wbGVtZW50cyBFdmVudEVtaXR0ZXJJbnRlcmZhY2Uge1xuICAgIHByaXZhdGUgZXZlbnRzOiBKUXVlcnkuUGxhaW5PYmplY3QgPSAkKHt9KTtcblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgLyBlbWl0IGFuIGV2ZW50XG4gICAgICovXG4gICAgZW1pdCguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudHMudHJpZ2dlci5hcHBseSh0aGlzLmV2ZW50cywgYXJncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgbGlzdGVuZXIgdG8gYW4gZXZlbnRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgYWRkTGlzdGVuZXIoZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbihldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIH1cbiAgICBvbiguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmcm9tIGFuIGV2ZW50XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudHMub2ZmKGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgfVxuICAgIG9mZiguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gYW4gZXZlbnQgY2FsbGJhY2sgb25jZVxuICAgICAqL1xuICAgIG9uY2UoLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9uZS5hcHBseSh0aGlzLmV2ZW50cywgYXJncyk7XG4gICAgfVxufSJdfQ==
