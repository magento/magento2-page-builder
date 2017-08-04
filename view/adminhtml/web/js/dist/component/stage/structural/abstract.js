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
define(["require", "exports", "./editable-area", "./options", "./options/option", "mage/translate"], function (require, exports, editable_area_1, options_1, option_1, $t) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * AbstractStructural class
     *
     * @author Dave Macaulay <dmacaulay@magento.com>
     */
    var AbstractStructural = (function (_super) {
        __extends(AbstractStructural, _super);
        /**
         * Abstract structural constructor
         *
         * @param parent
         * @param stage
         */
        function AbstractStructural(parent, stage) {
            var _this = _super.call(this, stage) || this;
            _this.options = [
                new option_1.Option(_this, 'move', '<i></i>', $t('Move'), false, ['move-structural'], 10),
                new option_1.Option(_this, 'edit', '<i></i>', $t('Edit'), _this.onOptionEdit.bind(_this), ['edit-block'], 50),
                new option_1.Option(_this, 'duplicate', '<i></i>', $t('Duplicate'), _this.onOptionDuplicate.bind(_this), ['duplicate-structural'], 60),
                new option_1.Option(_this, 'remove', '<i></i>', $t('Remove'), _this.onOptionRemove.bind(_this), ['remove-structural'], 100)
            ];
            _this.optionsInstance = new options_1.Options(_this, _this.options);
            _this.data = ko.observable({});
            _this.children = ko.observableArray([]);
            _this.template = 'Gene_BlueFoot/component/stage/structural/abstract.html';
            _this.childTemplate = 'Gene_BlueFoot/component/stage/structural/children.html';
            _super.prototype.setChildren.call(_this, _this.children);
            _this.parent = parent;
            _this.stage = stage;
            return _this;
        }
        AbstractStructural.prototype.onOptionEdit = function () {
        };
        AbstractStructural.prototype.onOptionDuplicate = function () {
        };
        AbstractStructural.prototype.onOptionRemove = function () {
        };
        /**
         * Retrieve the template from the class
         *
         * @deprecated use this.template instead
         * @returns {string}
         */
        AbstractStructural.prototype.getTemplate = function () {
            return this.template;
        };
        /**
         * Retrieve the child template
         *
         * @deprecated
         * @returns {string}
         */
        AbstractStructural.prototype.getChildTemplate = function () {
            return this.childTemplate;
        };
        return AbstractStructural;
    }(editable_area_1.EditableArea));
    exports.AbstractStructural = AbstractStructural;
});
//# sourceMappingURL=abstract.js.map