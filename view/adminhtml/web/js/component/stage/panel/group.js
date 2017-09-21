define(['exports', 'knockout'], function (exports, _knockout) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Group = undefined;

    var _knockout2 = _interopRequireDefault(_knockout);

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

            this.id = _knockout2.default.observable();
            this.code = _knockout2.default.observable('');
            this.name = _knockout2.default.observable('');
            this.icon = _knockout2.default.observable('');
            this.sort = _knockout2.default.observable();
            this.blocks = _knockout2.default.observableArray([]);
            this.active = _knockout2.default.observable(false);
            this.hidden = _knockout2.default.observable(false);
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


        Group.prototype.toggle = function toggle() {
            this.active(!this.active());
        };

        return Group;
    }();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9wYW5lbC9ncm91cC50cyJdLCJuYW1lcyI6WyJHcm91cCIsImlkIiwiZ3JvdXAiLCJibG9ja3MiLCJvYnNlcnZhYmxlIiwiY29kZSIsIm5hbWUiLCJpY29uIiwic29ydCIsIm9ic2VydmFibGVBcnJheSIsImFjdGl2ZSIsImhpZGRlbiIsInRvZ2dsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU9NQSxLLFdBQUFBLEs7QUFVRjs7Ozs7Ozs7O0FBU0EsdUJBQVlDLEVBQVosRUFBd0JDLEtBQXhCLEVBQTJEO0FBQUEsZ0JBQXZCQyxNQUF1Qix1RUFBRixFQUFFOztBQUFBOztBQWxCM0QsaUJBQUFGLEVBQUEsR0FBaUMsbUJBQUdHLFVBQUgsRUFBakM7QUFDQSxpQkFBQUMsSUFBQSxHQUFtQyxtQkFBR0QsVUFBSCxDQUFjLEVBQWQsQ0FBbkM7QUFDQSxpQkFBQUUsSUFBQSxHQUFtQyxtQkFBR0YsVUFBSCxDQUFjLEVBQWQsQ0FBbkM7QUFDQSxpQkFBQUcsSUFBQSxHQUFtQyxtQkFBR0gsVUFBSCxDQUFjLEVBQWQsQ0FBbkM7QUFDQSxpQkFBQUksSUFBQSxHQUFtQyxtQkFBR0osVUFBSCxFQUFuQztBQUNBLGlCQUFBRCxNQUFBLEdBQThDLG1CQUFHTSxlQUFILENBQW1CLEVBQW5CLENBQTlDO0FBQ0EsaUJBQUFDLE1BQUEsR0FBc0MsbUJBQUdOLFVBQUgsQ0FBYyxLQUFkLENBQXRDO0FBQ0EsaUJBQUFPLE1BQUEsR0FBc0MsbUJBQUdQLFVBQUgsQ0FBYyxLQUFkLENBQXRDO0FBWUksaUJBQUtILEVBQUwsQ0FBUUEsRUFBUjtBQUNBLGlCQUFLSSxJQUFMLENBQVVILE1BQU1HLElBQWhCO0FBQ0EsaUJBQUtDLElBQUwsQ0FBVUosTUFBTUksSUFBaEI7QUFDQSxpQkFBS0MsSUFBTCxDQUFVTCxNQUFNSyxJQUFoQjtBQUNBLGlCQUFLQyxJQUFMLENBQVVOLE1BQU1NLElBQWhCO0FBQ0EsaUJBQUtMLE1BQUwsQ0FBWUEsTUFBWjtBQUNIO0FBRUQ7Ozs7O3dCQUdBUyxNLHFCQUFNO0FBQ0YsaUJBQUtGLE1BQUwsQ0FBWSxDQUFDLEtBQUtBLE1BQUwsRUFBYjtBQUNILFMiLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3BhbmVsL2dyb3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGtvIGZyb20gJ2tub2Nrb3V0JztcblxuLyoqXG4gKiBHcm91cCBDbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgR3JvdXAge1xuICAgIGlkOiBLbm9ja291dE9ic2VydmFibGU8bnVtYmVyPiA9IGtvLm9ic2VydmFibGUoKTtcbiAgICBjb2RlOiBLbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIG5hbWU6IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+ID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgaWNvbjogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBzb3J0OiBLbm9ja291dE9ic2VydmFibGU8bnVtYmVyPiA9IGtvLm9ic2VydmFibGUoKTtcbiAgICBibG9ja3M6IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PEFycmF5PGFueT4+ID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcbiAgICBhY3RpdmU6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgIGhpZGRlbjogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cbiAgICAvKipcbiAgICAgKiBHcm91cCBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIGlkXG4gICAgICogQHBhcmFtIGdyb3VwXG4gICAgICogQHBhcmFtIGJsb2Nrc1xuICAgICAqXG4gICAgICogQHRvZG8gY2hhbmdlIGdyb3VwIHR5cGVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBncm91cDogYW55LCBibG9ja3M6IEFycmF5PGFueT4gPSBbXSkge1xuICAgICAgICB0aGlzLmlkKGlkKTtcbiAgICAgICAgdGhpcy5jb2RlKGdyb3VwLmNvZGUpO1xuICAgICAgICB0aGlzLm5hbWUoZ3JvdXAubmFtZSk7XG4gICAgICAgIHRoaXMuaWNvbihncm91cC5pY29uKTtcbiAgICAgICAgdGhpcy5zb3J0KGdyb3VwLnNvcnQpO1xuICAgICAgICB0aGlzLmJsb2NrcyhibG9ja3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSB0aGUgZ3JvdXBcbiAgICAgKi9cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlKCF0aGlzLmFjdGl2ZSgpKTtcbiAgICB9XG59Il19
