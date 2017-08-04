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
define(["require", "exports", "./abstract", "./column", "./options/option"], function (require, exports, abstract_1, column_1, option_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Row class
     *
     * @author Dave Macaulay <dmacaulay@magento.com>
     */
    var Row = (function (_super) {
        __extends(Row, _super);
        function Row() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.template = 'Gene_BlueFoot/component/stage/structural/row.html';
            // @todo determine how to merge with super
            _this.options = [
                new option_1.Option(_this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10),
            ];
            return _this;
        }
        /**
         * Add a column to the row
         *
         * @param data
         * @returns {any}
         */
        Row.prototype.addColumn = function (data) {
            var column = new column_1.Column(this, this.stage);
            this.addChild(column);
            column.updateColumnData(data);
            return column;
        };
        return Row;
    }(abstract_1.AbstractStructural));
    exports.Row = Row;
});
//# sourceMappingURL=row.js.map