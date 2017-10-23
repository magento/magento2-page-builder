define(["exports", "../stage/structural/abstract", "../stage/previews", "underscore"], function (exports, _abstract, _previews, _underscore) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _abstract2 = _interopRequireDefault(_abstract);

    var _previews2 = _interopRequireDefault(_previews);

    var _underscore2 = _interopRequireDefault(_underscore);

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

    var Block = function (_Structural) {
        _inherits(Block, _Structural);

        /**
         * AbstractBlock constructor
         *
         * @param parent
         * @param stage
         * @param config
         * @param formData
         */
        function Block(parent, stage, config, formData) {
            _classCallCheck(this, Block);

            var _this = _possibleConstructorReturn(this, _Structural.call(this, parent, stage, config));

            _this.editOnInsert = true;
            _this.childEntityKeys = [];
            _this.previewTemplate = 'Gene_BlueFoot/component/block/preview/abstract.html';
            _this.renderTemplate = 'Gene_BlueFoot/component/block/render/abstract.html';
            _this.preview = (0, _previews2.default)(_this, config);
            if (config.preview_template) {
                _this.previewTemplate = config.preview_template;
            }
            if (config.render_template) {
                _this.renderTemplate = config.render_template;
            }
            var defaults = {};
            if (config.fields) {
                _underscore2.default.each(config.fields, function (field, key) {
                    defaults[key] = field.default;
                });
            }
            _this.stage.store.update(_this.id, _underscore2.default.extend(defaults, formData));
            return _this;
        }

        return Block;
    }(_abstract2.default);

    exports.default = Block;
});