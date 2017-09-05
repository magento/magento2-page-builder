define(['exports', '../../../event-emitter', 'knockout'], function (exports, _eventEmitter, _knockout) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Block = undefined;

    var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

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

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Block = exports.Block = function (_EventEmitter) {
        _inherits(Block, _EventEmitter);

        /**
         * Block constructor
         *
         * @param config
         */
        function Block(config) {
            _classCallCheck(this, Block);

            var _this = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this));

            _this.code = ko.observable('');
            _this.name = ko.observable('');
            _this.icon = ko.observable('');
            _this.droppable = true;
            _this.config = config;
            _this.code(config.code);
            _this.name(config.name);
            _this.icon(config.icon);
            return _this;
        }

        return Block;
    }(_eventEmitter2.default);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9wYW5lbC9ncm91cC9ibG9jay50cyJdLCJuYW1lcyI6WyJrbyIsIkJsb2NrIiwiY29uZmlnIiwiY29kZSIsIm9ic2VydmFibGUiLCJuYW1lIiwiaWNvbiIsImRyb3BwYWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQUNZQSxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBT05DLEssV0FBQUEsSzs7O0FBT0Y7Ozs7O0FBS0EsdUJBQVlDLE1BQVosRUFBc0M7QUFBQTs7QUFBQTs7QUFWdEMsa0JBQUFDLElBQUEsR0FBbUNILEdBQUdJLFVBQUgsQ0FBYyxFQUFkLENBQW5DO0FBQ0Esa0JBQUFDLElBQUEsR0FBbUNMLEdBQUdJLFVBQUgsQ0FBYyxFQUFkLENBQW5DO0FBQ0Esa0JBQUFFLElBQUEsR0FBbUNOLEdBQUdJLFVBQUgsQ0FBYyxFQUFkLENBQW5DO0FBQ0Esa0JBQUFHLFNBQUEsR0FBcUIsSUFBckI7QUFTSSxrQkFBS0wsTUFBTCxHQUFjQSxNQUFkO0FBQ0Esa0JBQUtDLElBQUwsQ0FBVUQsT0FBT0MsSUFBakI7QUFDQSxrQkFBS0UsSUFBTCxDQUFVSCxPQUFPRyxJQUFqQjtBQUNBLGtCQUFLQyxJQUFMLENBQVVKLE9BQU9JLElBQWpCO0FBTGtDO0FBTXJDIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9wYW5lbC9ncm91cC9ibG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSBcIi4uLy4uLy4uL2V2ZW50LWVtaXR0ZXJcIjtcbmltcG9ydCAqIGFzIGtvIGZyb20gJ2tub2Nrb3V0JztcblxuLyoqXG4gKiBCbG9jayBDbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgQmxvY2sgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbmZpZzogQ29udGVudEJsb2NrQ29uZmlnO1xuICAgIGNvZGU6IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+ID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgbmFtZTogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBpY29uOiBLbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIGRyb3BwYWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBCbG9jayBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGVudEJsb2NrQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmNvZGUoY29uZmlnLmNvZGUpO1xuICAgICAgICB0aGlzLm5hbWUoY29uZmlnLm5hbWUpO1xuICAgICAgICB0aGlzLmljb24oY29uZmlnLmljb24pO1xuICAgIH1cbn0iXX0=
