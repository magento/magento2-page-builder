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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9wYW5lbC9ncm91cC50cyJdLCJuYW1lcyI6WyJrbyIsIkdyb3VwIiwiaWQiLCJncm91cCIsImJsb2NrcyIsIm9ic2VydmFibGUiLCJjb2RlIiwibmFtZSIsImljb24iLCJzb3J0Iiwib2JzZXJ2YWJsZUFycmF5IiwiYWN0aXZlIiwiaGlkZGVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQUFZQSxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBT05DLEssV0FBQUEsSztBQVVGOzs7Ozs7Ozs7QUFTQSx1QkFBWUMsRUFBWixFQUF3QkMsS0FBeEIsRUFBMkQ7QUFBQSxnQkFBdkJDLE1BQXVCLHVFQUFGLEVBQUU7O0FBQUE7O0FBbEIzRCxpQkFBQUYsRUFBQSxHQUFpQ0YsR0FBR0ssVUFBSCxFQUFqQztBQUNBLGlCQUFBQyxJQUFBLEdBQW1DTixHQUFHSyxVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGlCQUFBRSxJQUFBLEdBQW1DUCxHQUFHSyxVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGlCQUFBRyxJQUFBLEdBQW1DUixHQUFHSyxVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGlCQUFBSSxJQUFBLEdBQW1DVCxHQUFHSyxVQUFILEVBQW5DO0FBQ0EsaUJBQUFELE1BQUEsR0FBOENKLEdBQUdVLGVBQUgsQ0FBbUIsRUFBbkIsQ0FBOUM7QUFDQSxpQkFBQUMsTUFBQSxHQUFzQ1gsR0FBR0ssVUFBSCxDQUFjLEtBQWQsQ0FBdEM7QUFDQSxpQkFBQU8sTUFBQSxHQUFzQ1osR0FBR0ssVUFBSCxDQUFjLEtBQWQsQ0FBdEM7QUFZSSxpQkFBS0gsRUFBTCxDQUFRQSxFQUFSO0FBQ0EsaUJBQUtJLElBQUwsQ0FBVUgsTUFBTUcsSUFBaEI7QUFDQSxpQkFBS0MsSUFBTCxDQUFVSixNQUFNSSxJQUFoQjtBQUNBLGlCQUFLQyxJQUFMLENBQVVMLE1BQU1LLElBQWhCO0FBQ0EsaUJBQUtDLElBQUwsQ0FBVU4sTUFBTU0sSUFBaEI7QUFDQSxpQkFBS0wsTUFBTCxDQUFZQSxNQUFaO0FBQ0g7QUFFRDs7Ozs7OztxQ0FHTTtBQUNGLHFCQUFLTyxNQUFMLENBQVksQ0FBQyxLQUFLQSxNQUFMLEVBQWI7QUFDSCIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2UvcGFuZWwvZ3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCc7XG5cbi8qKlxuICogR3JvdXAgQ2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIEdyb3VwIHtcbiAgICBpZDogS25vY2tvdXRPYnNlcnZhYmxlPG51bWJlcj4gPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgY29kZTogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBuYW1lOiBLbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIGljb246IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+ID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgc29ydDogS25vY2tvdXRPYnNlcnZhYmxlPG51bWJlcj4gPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgYmxvY2tzOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxBcnJheTxhbnk+PiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgYWN0aXZlOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj4gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICBoaWRkZW46IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG4gICAgLyoqXG4gICAgICogR3JvdXAgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBncm91cFxuICAgICAqIEBwYXJhbSBibG9ja3NcbiAgICAgKlxuICAgICAqIEB0b2RvIGNoYW5nZSBncm91cCB0eXBlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgZ3JvdXA6IGFueSwgYmxvY2tzOiBBcnJheTxhbnk+ID0gW10pIHtcbiAgICAgICAgdGhpcy5pZChpZCk7XG4gICAgICAgIHRoaXMuY29kZShncm91cC5jb2RlKTtcbiAgICAgICAgdGhpcy5uYW1lKGdyb3VwLm5hbWUpO1xuICAgICAgICB0aGlzLmljb24oZ3JvdXAuaWNvbik7XG4gICAgICAgIHRoaXMuc29ydChncm91cC5zb3J0KTtcbiAgICAgICAgdGhpcy5ibG9ja3MoYmxvY2tzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgdGhlIGdyb3VwXG4gICAgICovXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZSghdGhpcy5hY3RpdmUoKSk7XG4gICAgfVxufSJdfQ==
