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

            var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

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