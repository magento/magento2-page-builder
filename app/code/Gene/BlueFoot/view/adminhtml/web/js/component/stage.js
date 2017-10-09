define(['exports', './stage/structural/editable-area', './stage/structural/row', 'underscore', './data-store', 'mage/translate'], function (exports, _editableArea, _row, _underscore, _dataStore, _translate) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _editableArea2 = _interopRequireDefault(_editableArea);

    var _row2 = _interopRequireDefault(_row);

    var _underscore2 = _interopRequireDefault(_underscore);

    var _dataStore2 = _interopRequireDefault(_dataStore);

    var _translate2 = _interopRequireDefault(_translate);

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

    var Stage = function (_EditableArea) {
        _inherits(Stage, _EditableArea);

        /**
         * Stage constructor
         *
         * @param parent
         * @param stageContent
         */
        function Stage(parent, stageContent) {
            _classCallCheck(this, Stage);

            var _this = _possibleConstructorReturn(this, _EditableArea.call(this));

            _this.active = true;
            _this.serializeRole = 'stage';
            _this.setChildren(stageContent);
            _this.stage = _this;
            _this.parent = parent;
            _this.showBorders = parent.showBorders;
            _this.userSelect = parent.userSelect;
            _this.loading = parent.loading;
            // Create our state and store objects
            _this.store = new _dataStore2.default();
            _underscore2.default.bindAll(_this, 'onSortingStart', 'onSortingStop');
            _this.on('sortingStart', _this.onSortingStart);
            _this.on('sortingStop', _this.onSortingStop);
            return _this;
        }
        /**
         * Run the build system to initiate from existing structures
         */


        Stage.prototype.build = function build() {
            // @todo implement new storage format proposal build system
            this.addRow(this);
            this.ready();
        };

        Stage.prototype.ready = function ready() {
            this.emit('stageReady');
            this.children.valueHasMutated();
            this.loading(false);
        };

        Stage.prototype.addRow = function addRow(self, data) {
            var row = new _row2.default(self, self);
            this.store.update(row.id, data);
            this.addChild(row);
            return row;
        };

        Stage.prototype.openTemplateManager = function openTemplateManager() {
            // @todo
        };

        Stage.prototype.addComponent = function addComponent() {}
        // @todo

        /**
         * Event handler for any element being sorted in the stage
         */
        ;

        Stage.prototype.onSortingStart = function onSortingStart() {
            this.showBorders(true);
        };

        Stage.prototype.onSortingStop = function onSortingStop() {
            this.showBorders(false);
        };

        Stage.prototype.removeChild = function removeChild(child) {
            if (this.children().length == 1) {
                this.parent.alertDialog({
                    title: (0, _translate2.default)('Unable to Remove'),
                    content: (0, _translate2.default)('You are not able to remove the final row from the content.')
                });
                return;
            }
            _EditableArea.prototype.removeChild.call(this, child);
        };

        return Stage;
    }(_editableArea2.default);

    exports.default = Stage;
});