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
define(["require", "exports", "./stage/structural/editable-area", "./stage/structural/row", "underscore"], function (require, exports, editable_area_1, row_1, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Stage class
     *
     * @author Dave Macaulay <dmacaulay@magento.com>
     */
    var Stage = (function (_super) {
        __extends(Stage, _super);
        /**
         * Stage constructor
         *
         * @param parent
         * @param stageContent
         */
        function Stage(parent, stageContent) {
            var _this = _super.call(this) || this;
            _this.active = true;
            _this.serializeRole = 'stage';
            _super.prototype.setChildren.call(_this, stageContent);
            _this.parent = parent;
            _this.showBorders = parent.showBorder;
            _this.userSelect = parent.userSelect;
            _this.loading = parent.loading;
            _.bindAll(_this, 'onSortingStart', 'onSortingStop');
            _this.on('sortingStart', _this.onSortingStart);
            _this.on('sortingStop', _this.onSortingStop);
            return _this;
        }
        Stage.prototype.build = function () {
            // @todo
        };
        /**
         * The stage has been initiated fully and is ready
         */
        Stage.prototype.ready = function () {
            this.emit('stageReady');
            this.children.valueHasMutated();
            this.loading(false);
        };
        /**
         * Add a row to the stage
         *
         * @param self
         * @param data
         * @returns {Row}
         */
        Stage.prototype.addRow = function (self, data) {
            var row = new row_1.Row(self, self);
            row.data(data);
            this.addChild(row);
            return row;
        };
        Stage.prototype.openTemplateManager = function () {
            // @todo
        };
        Stage.prototype.addComponent = function () {
            // @todo
        };
        /**
         * Event handler for any element being sorted in the stage
         */
        Stage.prototype.onSortingStart = function () {
            this.showBorders(true);
        };
        /**
         * Event handler for when sorting stops
         */
        Stage.prototype.onSortingStop = function () {
            this.showBorders(false);
        };
        return Stage;
    }(editable_area_1.EditableArea));
    exports.Stage = Stage;
});
//# sourceMappingURL=stage.js.map