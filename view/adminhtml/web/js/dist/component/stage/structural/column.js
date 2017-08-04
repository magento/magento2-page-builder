var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./abstract", "../../config", "../../../utils/array", "./options/option"], function (require, exports, abstract_1, config_1, array_1, option_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Column class
     *
     * @author Dave Macaulay <dmacaulay@magento.com>
     */
    var Column = (function (_super) {
        __extends(Column, _super);
        function Column() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.template = 'Gene_BlueFoot/component/stage/structural/column.html';
            // @todo determine how to merge with super
            _this.options = [
                new option_1.Option(_this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10),
            ];
            _this.columnDefinition = ko.observable(config_1.Config.getInitConfig('column_definitions')[0]);
            _this.widthClasses = ko.computed(function () {
                return this.columnDefinition()['className'];
            }, _this);
            _this.serializedWidth = ko.computed(function () {
                return this.columnDefinition()['breakpoint'] * 100;
            }, _this);
            return _this;
        }
        /**
         * Add a column to self
         *
         * @param data
         * @returns {Column}
         */
        Column.prototype.addColumn = function (data) {
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
        Column.prototype.insertColumnAtIndex = function (direction, item, data) {
            var index = ko.utils.arrayIndexOf(item.parent.children(), item), column = new Column(item.parent, item.parent.stage);
            if (direction == 'right') {
                ++index;
            }
            array_1.moveArrayItemIntoArray(column, item.parent.children, index);
            column.updateColumnData(data);
            return column;
        };
        /**
         * Update the column data to reflect the correct width
         *
         * @param data
         */
        Column.prototype.updateColumnData = function (data) {
            data = data || {};
            if (data.width) {
                var columnDef = config_1.Config.getColumnDefinitionByBreakpoint(data.width);
                if (columnDef) {
                    this.columnDefinition(columnDef);
                }
            }
            else if (data.className) {
                this.columnDefinition(config_1.Config.getColumnDefinitionByClassName(data.className));
            }
            this.data(data);
        };
        /**
         * Handle sort starting on column
         *
         * @param event
         * @param params
         * @returns {any}
         */
        Column.prototype.onSortStart = function (event, params) {
            // Copy over the column class for the width
            jQuery(params.placeholder).addClass(this.widthClasses());
            return _super.prototype.onSortStart.call(this, event, params);
        };
        return Column;
    }(abstract_1.AbstractStructural));
    exports.Column = Column;
});
//# sourceMappingURL=column.js.map