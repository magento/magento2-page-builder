define(["exports", "./editable-area", "./options", "./options/option", "./column/builder", "../edit", "../../../utils/style-attribute-filter", "../../../utils/style-attribute-mapper", "../../../utils/attribute-filter", "../../../utils/attribute-mapper", "../../../utils/appearance-applier", "mage/translate", "knockout", "underscore"], function (exports, _editableArea, _options, _option, _builder, _edit, _styleAttributeFilter, _styleAttributeMapper, _attributeFilter, _attributeMapper, _appearanceApplier, _translate, _knockout, _underscore) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _editableArea2 = _interopRequireDefault(_editableArea);

    var _edit2 = _interopRequireDefault(_edit);

    var _styleAttributeFilter2 = _interopRequireDefault(_styleAttributeFilter);

    var _styleAttributeMapper2 = _interopRequireDefault(_styleAttributeMapper);

    var _attributeFilter2 = _interopRequireDefault(_attributeFilter);

    var _attributeMapper2 = _interopRequireDefault(_attributeMapper);

    var _appearanceApplier2 = _interopRequireDefault(_appearanceApplier);

    var _translate2 = _interopRequireDefault(_translate);

    var _knockout2 = _interopRequireDefault(_knockout);

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

    var Structural = function (_EditableArea) {
        _inherits(Structural, _EditableArea);

        /**
         * Abstract structural constructor
         *
         * @param parent
         * @param stage
         * @param config
         */
        function Structural(parent, stage) {
            var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            _classCallCheck(this, Structural);

            var _this = _possibleConstructorReturn(this, _EditableArea.call(this, stage));

            _this.wrapperStyle = _knockout2.default.observable({ width: '100%' });
            _this.options = [new _option.Option(_this, 'move', '<i></i>', (0, _translate2.default)('Move'), false, ['move-structural'], 10), new _option.Option(_this, 'edit', '<i></i>', (0, _translate2.default)('Edit'), _this.onOptionEdit.bind(_this), ['edit-block'], 50), new _option.Option(_this, 'duplicate', '<i></i>', (0, _translate2.default)('Duplicate'), _this.onOptionDuplicate.bind(_this), ['duplicate-structural'], 60), new _option.Option(_this, 'remove', '<i></i>', (0, _translate2.default)('Remove'), _this.onOptionRemove.bind(_this), ['remove-structural'], 100)];
            _this.optionsInstance = new _options.Options(_this, _this.options);
            _this.children = _knockout2.default.observableArray([]);
            _this.template = 'Gene_BlueFoot/component/stage/structural/abstract.html';
            _this.columnBuilder = new _builder.ColumnBuilder();
            _this.previewChildTemplate = 'Gene_BlueFoot/component/block/preview/children.html';
            _this.renderChildTemplate = 'Gene_BlueFoot/component/block/render/children.html';
            _EditableArea.prototype.setChildren.call(_this, _this.children);
            // Create a new instance of edit for our editing needs
            _this.edit = new _edit2.default(_this, _this.stage.store);
            _this.styleAttributeFilter = new _styleAttributeFilter2.default();
            _this.styleAttributeMapper = new _styleAttributeMapper2.default();
            _this.attributeFilter = new _attributeFilter2.default();
            _this.attributeMapper = new _attributeMapper2.default();
            _this.appearanceApplier = new _appearanceApplier2.default();
            _this.parent = parent;
            _this.stage = stage;
            _this.config = config;
            return _this;
        }

        Structural.prototype.onOptionEdit = function onOptionEdit() {
            this.edit.openAndRender();
        };

        Structural.prototype.onOptionDuplicate = function onOptionDuplicate() {
            this.parent.duplicateChild(this);
        };

        Structural.prototype.onOptionRemove = function onOptionRemove() {
            var _this2 = this;

            this.stage.parent.confirmationDialog({
                title: 'Confirm Item Removal',
                content: 'Are you sure you want to remove this item? The data within this item is not recoverable once removed.',
                actions: {
                    confirm: function confirm() {
                        // Call the parent to remove the child element
                        _this2.parent.emit('blockRemoved', {
                            block: _this2
                        });
                    }
                }
            });
        };

        Structural.prototype.getCss = function getCss() {
            var cssClasses = {};
            if ('css_classes' in this.getData()) {
                this.getData().css_classes.map(function (value, index) {
                    return cssClasses[value] = true;
                });
            }
            return cssClasses;
        };

        Structural.prototype.getStyle = function getStyle() {
            var styleAttributes = this.getData();
            styleAttributes = this.appearanceApplier.apply(styleAttributes);
            return this.styleAttributeMapper.toDom(this.styleAttributeFilter.filter(styleAttributes));
        };

        Structural.prototype.getAttributes = function getAttributes() {
            var data = this.getData();
            _underscore2.default.extend(data, this.config);
            return this.attributeMapper.toDom(this.attributeFilter.filter(data));
        };

        Structural.prototype.getData = function getData() {
            return this.stage.store.get(this.id);
        };

        return Structural;
    }(_editableArea2.default);

    exports.default = Structural;
});