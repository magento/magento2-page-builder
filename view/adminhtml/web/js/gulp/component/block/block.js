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
define(["require", "exports", "../stage/structural/abstract"], function (require, exports, abstract_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * AbstractBlock class
     *
     * @author Dave Macaulay <dmacaulay@magento.com>
     */
    var Block = (function (_super) {
        __extends(Block, _super);
        /**
         * AbstractBlock constructor
         *
         * @param parent
         * @param stage
         * @param config
         * @param formData
         */
        function Block(parent, stage, config, formData) {
            var _this = _super.call(this, parent, stage) || this;
            _this.editOnInsert = true;
            _this.childEntityKeys = [];
            return _this;
        }
        return Block;
    }(abstract_1.AbstractStructural));
    exports.Block = Block;
});
