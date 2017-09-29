define(["exports", "../stage/structural/abstract", "../stage/previews", "mage/translate", "underscore"], function (exports, _abstract, _previews, _translate, _underscore) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _abstract2 = _interopRequireDefault(_abstract);

    var _previews2 = _interopRequireDefault(_previews);

    var _translate2 = _interopRequireDefault(_translate);

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
            _this.template = 'Gene_BlueFoot/component/block/abstract.html';
            // @todo temp for testing, remove after building edit capabilities
            _this.defaults = {
                heading_type: 'h2',
                title: (0, _translate2.default)('Type heading content here...')
            };
            _this.preview = (0, _previews2.default)(_this, config);
            _this.stage.store.update(_this.id, _underscore2.default.extend(_this.defaults, formData));
            return _this;
        }
        /**
         * Retrieve the template from the preview or super
         *
         * @returns {string}
         */


        Block.prototype.getTemplate = function getTemplate() {
            if (this.preview.template) {
                return this.preview.template;
            }
            // Implement preview template system here
            return _Structural.prototype.getTemplate.call(this);
        };

        return Block;
    }(_abstract2.default);

    exports.default = Block;
});