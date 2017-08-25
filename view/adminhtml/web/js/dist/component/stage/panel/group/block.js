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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvc3RhZ2UvcGFuZWwvZ3JvdXAvYmxvY2sudHMiXSwibmFtZXMiOlsia28iLCJCbG9jayIsImNvbmZpZyIsImNvZGUiLCJvYnNlcnZhYmxlIiwibmFtZSIsImljb24iLCJkcm9wcGFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFDWUEsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU9OQyxLLFdBQUFBLEs7OztBQU9GOzs7OztBQUtBLHVCQUFZQyxNQUFaLEVBQXNDO0FBQUE7O0FBQUE7O0FBVnRDLGtCQUFBQyxJQUFBLEdBQW1DSCxHQUFHSSxVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGtCQUFBQyxJQUFBLEdBQW1DTCxHQUFHSSxVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGtCQUFBRSxJQUFBLEdBQW1DTixHQUFHSSxVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGtCQUFBRyxTQUFBLEdBQXFCLElBQXJCO0FBU0ksa0JBQUtMLE1BQUwsR0FBY0EsTUFBZDtBQUNBLGtCQUFLQyxJQUFMLENBQVVELE9BQU9DLElBQWpCO0FBQ0Esa0JBQUtFLElBQUwsQ0FBVUgsT0FBT0csSUFBakI7QUFDQSxrQkFBS0MsSUFBTCxDQUFVSixPQUFPSSxJQUFqQjtBQUxrQztBQU1yQyIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2UvcGFuZWwvZ3JvdXAvYmxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gXCIuLi8uLi8uLi9ldmVudC1lbWl0dGVyXCI7XG5pbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCc7XG5cbi8qKlxuICogQmxvY2sgQ2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIEJsb2NrIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBjb25maWc6IENvbnRlbnRCbG9ja0NvbmZpZztcbiAgICBjb2RlOiBLbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIG5hbWU6IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+ID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgaWNvbjogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICBkcm9wcGFibGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogQmxvY2sgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb25maWdcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbnRlbnRCbG9ja0NvbmZpZykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5jb2RlKGNvbmZpZy5jb2RlKTtcbiAgICAgICAgdGhpcy5uYW1lKGNvbmZpZy5uYW1lKTtcbiAgICAgICAgdGhpcy5pY29uKGNvbmZpZy5pY29uKTtcbiAgICB9XG59Il19
