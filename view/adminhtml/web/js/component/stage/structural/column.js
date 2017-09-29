define(["exports", "./abstract", "../../config", "../../../utils/array", "./options/option", "knockout"], function (exports, _abstract, _config, _array, _option, _knockout) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Column = undefined;

    var _config2 = _interopRequireDefault(_config);

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

    var Column = exports.Column = function (_AbstractStructural) {
        _inherits(Column, _AbstractStructural);

        /**
         * Abstract structural constructor
         *
         * @param parent
         * @param stage
         */
        function Column(parent, stage) {
            _classCallCheck(this, Column);

            var _this = _possibleConstructorReturn(this, _AbstractStructural.call(this, parent, stage));

            _this.template = 'Gene_BlueFoot/component/stage/structural/column.html';
            _this.columnDefinition = _knockout2.default.observable(_config2.default.getInitConfig('column_definitions')[0]);
            _this.widthClasses = _knockout2.default.computed(function () {
                return this.columnDefinition()['className'];
            }, _this);
            _this.serializedWidth = _knockout2.default.computed(function () {
                return this.columnDefinition()['breakpoint'] * 100;
            }, _this);
            _this.options.push(new _option.Option(_this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10));
            return _this;
        }
        /**
         * Add a column to self
         *
         * @param data
         * @returns {Column}
         */


        Column.prototype.addColumn = function addColumn(data) {
            var column = new Column(this, this.stage);
            this.addChild(column);
            column.updateColumnData(data);
            return column;
        };
        /**
         * Insert a column at a specific instance
         *
         * @param direction
         * @param item
         * @param data
         * @returns {Column}
         */


        Column.prototype.insertColumnAtIndex = function insertColumnAtIndex(direction, item, data) {
            var index = _knockout2.default.utils.arrayIndexOf(item.parent.children(), item),
                column = new Column(item.parent, item.parent.stage);
            if (direction == 'right') {
                ++index;
            }
            (0, _array.moveArrayItemIntoArray)(column, item.parent.children, index);
            column.updateColumnData(data);
            return column;
        };
        /**
         * Update the column data to reflect the correct width
         *
         * @param data
         */


        Column.prototype.updateColumnData = function updateColumnData(data) {
            data = data || {};
            if (data.width) {
                var columnDef = _config2.default.getColumnDefinitionByBreakpoint(data.width);
                if (columnDef) {
                    this.columnDefinition(columnDef);
                }
            } else if (data.className) {
                this.columnDefinition(_config2.default.getColumnDefinitionByClassName(data.className));
            }
            this.stage.store.update(this.id, data);
        };
        /**
         * Handle sort starting on column
         *
         * @param event
         * @param params
         * @returns {any}
         */


        Column.prototype.onSortStart = function onSortStart(event, params) {
            // Copy over the column class for the width
            jQuery(params.placeholder).addClass(this.widthClasses());
            return _AbstractStructural.prototype.onSortStart.call(this, event, params);
        };

        return Column;
    }(_abstract.AbstractStructural);
});