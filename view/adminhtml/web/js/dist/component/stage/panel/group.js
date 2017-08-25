define(['exports', 'knockout'], function (exports, _knockout) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Group = undefined;

    var ko = _interopRequireWildcard(_knockout);

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

    var Group = exports.Group = function () {
        /**
         * Group constructor
         *
         * @param id
         * @param group
         * @param blocks
         *
         * @todo change group type
         */
        function Group(id, group) {
            var blocks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            _classCallCheck(this, Group);

            this.id = ko.observable();
            this.code = ko.observable('');
            this.name = ko.observable('');
            this.icon = ko.observable('');
            this.sort = ko.observable();
            this.blocks = ko.observableArray([]);
            this.active = ko.observable(false);
            this.hidden = ko.observable(false);
            this.id(id);
            this.code(group.code);
            this.name(group.name);
            this.icon(group.icon);
            this.sort(group.sort);
            this.blocks(blocks);
        }
        /**
         * Toggle the group
         */


        _createClass(Group, [{
            key: 'toggle',
            value: function toggle() {
                this.active(!this.active());
            }
        }]);

        return Group;
    }();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvc3RhZ2UvcGFuZWwvZ3JvdXAudHMiXSwibmFtZXMiOlsia28iLCJHcm91cCIsImlkIiwiZ3JvdXAiLCJibG9ja3MiLCJvYnNlcnZhYmxlIiwiY29kZSIsIm5hbWUiLCJpY29uIiwic29ydCIsIm9ic2VydmFibGVBcnJheSIsImFjdGl2ZSIsImhpZGRlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFBWUEsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU9OQyxLLFdBQUFBLEs7QUFVRjs7Ozs7Ozs7O0FBU0EsdUJBQVlDLEVBQVosRUFBd0JDLEtBQXhCLEVBQTJEO0FBQUEsZ0JBQXZCQyxNQUF1Qix1RUFBRixFQUFFOztBQUFBOztBQWxCM0QsaUJBQUFGLEVBQUEsR0FBaUNGLEdBQUdLLFVBQUgsRUFBakM7QUFDQSxpQkFBQUMsSUFBQSxHQUFtQ04sR0FBR0ssVUFBSCxDQUFjLEVBQWQsQ0FBbkM7QUFDQSxpQkFBQUUsSUFBQSxHQUFtQ1AsR0FBR0ssVUFBSCxDQUFjLEVBQWQsQ0FBbkM7QUFDQSxpQkFBQUcsSUFBQSxHQUFtQ1IsR0FBR0ssVUFBSCxDQUFjLEVBQWQsQ0FBbkM7QUFDQSxpQkFBQUksSUFBQSxHQUFtQ1QsR0FBR0ssVUFBSCxFQUFuQztBQUNBLGlCQUFBRCxNQUFBLEdBQThDSixHQUFHVSxlQUFILENBQW1CLEVBQW5CLENBQTlDO0FBQ0EsaUJBQUFDLE1BQUEsR0FBc0NYLEdBQUdLLFVBQUgsQ0FBYyxLQUFkLENBQXRDO0FBQ0EsaUJBQUFPLE1BQUEsR0FBc0NaLEdBQUdLLFVBQUgsQ0FBYyxLQUFkLENBQXRDO0FBWUksaUJBQUtILEVBQUwsQ0FBUUEsRUFBUjtBQUNBLGlCQUFLSSxJQUFMLENBQVVILE1BQU1HLElBQWhCO0FBQ0EsaUJBQUtDLElBQUwsQ0FBVUosTUFBTUksSUFBaEI7QUFDQSxpQkFBS0MsSUFBTCxDQUFVTCxNQUFNSyxJQUFoQjtBQUNBLGlCQUFLQyxJQUFMLENBQVVOLE1BQU1NLElBQWhCO0FBQ0EsaUJBQUtMLE1BQUwsQ0FBWUEsTUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7cUNBR007QUFDRixxQkFBS08sTUFBTCxDQUFZLENBQUMsS0FBS0EsTUFBTCxFQUFiO0FBQ0giLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3BhbmVsL2dyb3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMga28gZnJvbSAna25vY2tvdXQnO1xuXG4vKipcbiAqIEdyb3VwIENsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBHcm91cCB7XG4gICAgaWQ6IEtub2Nrb3V0T2JzZXJ2YWJsZTxudW1iZXI+ID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgIGNvZGU6IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+ID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgbmFtZTogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBpY29uOiBLbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIHNvcnQ6IEtub2Nrb3V0T2JzZXJ2YWJsZTxudW1iZXI+ID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgIGJsb2NrczogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8QXJyYXk8YW55Pj4gPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuICAgIGFjdGl2ZTogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgaGlkZGVuOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj4gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuICAgIC8qKlxuICAgICAqIEdyb3VwIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKiBAcGFyYW0gZ3JvdXBcbiAgICAgKiBAcGFyYW0gYmxvY2tzXG4gICAgICpcbiAgICAgKiBAdG9kbyBjaGFuZ2UgZ3JvdXAgdHlwZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIGdyb3VwOiBhbnksIGJsb2NrczogQXJyYXk8YW55PiA9IFtdKSB7XG4gICAgICAgIHRoaXMuaWQoaWQpO1xuICAgICAgICB0aGlzLmNvZGUoZ3JvdXAuY29kZSk7XG4gICAgICAgIHRoaXMubmFtZShncm91cC5uYW1lKTtcbiAgICAgICAgdGhpcy5pY29uKGdyb3VwLmljb24pO1xuICAgICAgICB0aGlzLnNvcnQoZ3JvdXAuc29ydCk7XG4gICAgICAgIHRoaXMuYmxvY2tzKGJsb2Nrcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBncm91cFxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmUoIXRoaXMuYWN0aXZlKCkpO1xuICAgIH1cbn0iXX0=
