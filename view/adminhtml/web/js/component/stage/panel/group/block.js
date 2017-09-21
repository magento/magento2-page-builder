define(['exports', '../../../event-emitter', 'knockout'], function (exports, _eventEmitter, _knockout) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Block = undefined;

    var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

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

            _this.code = _knockout2.default.observable('');
            _this.name = _knockout2.default.observable('');
            _this.icon = _knockout2.default.observable('');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9wYW5lbC9ncm91cC9ibG9jay50cyJdLCJuYW1lcyI6WyJCbG9jayIsImNvbmZpZyIsImNvZGUiLCJvYnNlcnZhYmxlIiwibmFtZSIsImljb24iLCJkcm9wcGFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQVFNQSxLLFdBQUFBLEs7OztBQU9GOzs7OztBQUtBLHVCQUFZQyxNQUFaLEVBQXNDO0FBQUE7O0FBQUE7O0FBVnRDLGtCQUFBQyxJQUFBLEdBQW1DLG1CQUFHQyxVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGtCQUFBQyxJQUFBLEdBQW1DLG1CQUFHRCxVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGtCQUFBRSxJQUFBLEdBQW1DLG1CQUFHRixVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGtCQUFBRyxTQUFBLEdBQXFCLElBQXJCO0FBU0ksa0JBQUtMLE1BQUwsR0FBY0EsTUFBZDtBQUNBLGtCQUFLQyxJQUFMLENBQVVELE9BQU9DLElBQWpCO0FBQ0Esa0JBQUtFLElBQUwsQ0FBVUgsT0FBT0csSUFBakI7QUFDQSxrQkFBS0MsSUFBTCxDQUFVSixPQUFPSSxJQUFqQjtBQUxrQztBQU1yQyIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2UvcGFuZWwvZ3JvdXAvYmxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gXCIuLi8uLi8uLi9ldmVudC1lbWl0dGVyXCI7XG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuXG4vKipcbiAqIEJsb2NrIENsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBCbG9jayBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uZmlnOiBDb250ZW50QmxvY2tDb25maWc7XG4gICAgY29kZTogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBuYW1lOiBLbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIGljb246IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+ID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgZHJvcHBhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEJsb2NrIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29uZmlnXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBDb250ZW50QmxvY2tDb25maWcpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuY29kZShjb25maWcuY29kZSk7XG4gICAgICAgIHRoaXMubmFtZShjb25maWcubmFtZSk7XG4gICAgICAgIHRoaXMuaWNvbihjb25maWcuaWNvbik7XG4gICAgfVxufSJdfQ==
