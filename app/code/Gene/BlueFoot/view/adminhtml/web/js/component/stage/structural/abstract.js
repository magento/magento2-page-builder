define(["exports", "./editable-area", "./options", "./options/option", "./column/builder", "mage/translate", "knockout", "uiRegistry"], function (exports, _editableArea, _options, _option, _builder, _translate, _knockout, _uiRegistry) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _editableArea2 = _interopRequireDefault(_editableArea);

    var _translate2 = _interopRequireDefault(_translate);

    var _knockout2 = _interopRequireDefault(_knockout);

    var _uiRegistry2 = _interopRequireDefault(_uiRegistry);

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
            _this.childTemplate = 'Gene_BlueFoot/component/stage/structural/children.html';
            _this.columnBuilder = new _builder.ColumnBuilder();
            _EditableArea.prototype.setChildren.call(_this, _this.children);
            _this.parent = parent;
            _this.stage = stage;
            _this.config = config;
            return _this;
        }
        /**
         * Open edit panel when user requests to edit instance
         *
         * @todo refactor, abstract, this is just a prototype
         */


        Structural.prototype.onOptionEdit = function onOptionEdit() {
            var _this2 = this;

            // @todo dynamically build from config
            var formComponent = 'bluefoot_heading_form';
            var modal = _uiRegistry2.default.get('bluefoot_modal_form.bluefoot_modal_form.modal'),
                insertForm = _uiRegistry2.default.get('bluefoot_modal_form.bluefoot_modal_form.modal.insert_form');
            // Destroy any existing components that exist for this type
            var existingComponent = void 0;
            if (existingComponent = _uiRegistry2.default.get(formComponent + '.' + formComponent)) {
                existingComponent.destroy();
            }
            modal.setTitle((0, _translate2.default)('Edit ' + (this.config.name || (0, _translate2.default)('Block'))));
            modal.openModal();
            // Reset the insert form component
            insertForm.destroyInserted();
            insertForm.removeActions();
            // Pass the UI component to the render function
            insertForm.onRender(window.components['bluefoot_heading_form']);
            // Retrieve the component
            _uiRegistry2.default.get(formComponent + '.' + formComponent, function (component) {
                var provider = _uiRegistry2.default.get(component.provider);
                // Set the instance to act as it's client in the data provider
                provider.client = _this2;
                // Set the data on the provider from the data store
                provider.set('data', _this2.stage.store.get(_this2.id));
            });
        };

        Structural.prototype.save = function save(data, options) {
            this.stage.store.update(this.id, data);
            _uiRegistry2.default.get('bluefoot_modal_form.bluefoot_modal_form.modal').closeModal();
        };

        Structural.prototype.onOptionDuplicate = function onOptionDuplicate() {
            this.parent.duplicateChild(this);
        };

        Structural.prototype.onOptionRemove = function onOptionRemove() {
            var _this3 = this;

            this.stage.parent.confirmationDialog({
                title: 'Confirm Item Removal',
                content: 'Are you sure you want to remove this item? The data within this item is not recoverable once removed.',
                actions: {
                    confirm: function confirm() {
                        // Call the parent to remove the child element
                        _this3.parent.emit('blockRemoved', {
                            block: _this3
                        });
                    }
                }
            });
        };

        Structural.prototype.getTemplate = function getTemplate() {
            return this.template;
        };

        Structural.prototype.getChildTemplate = function getChildTemplate() {
            return this.childTemplate;
        };

        Structural.prototype.getChildPreviewTemplate = function getChildPreviewTemplate() {
            return 'Gene_BlueFoot/component/stage/structural/render/children.html';
        };

        Structural.prototype.getPreviewTemplate = function getPreviewTemplate() {
            return 'Gene_BlueFoot/component/stage/structural/render/abstract.html';
        };

        return Structural;
    }(_editableArea2.default);

    exports.default = Structural;
});