define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Option Class
     *
     * @author Dave Macaulay <dmacaulay@magento.com>
     */
    var Option = (function () {
        /**
         * Option constructor
         *
         * @param parent
         * @param code
         * @param icon
         * @param title
         * @param action
         * @param classes
         * @param sort
         * @param template
         */
        function Option(parent, code, icon, title, action, classes, sort, template) {
            this.action = false;
            this.classes = [];
            this.template = null;
            this.parent = parent;
            this.code = code;
            this.icon = icon;
            this.title = title;
            this.action = action;
            this.classes = classes;
            this.sort = sort;
            this.template = template;
        }
        /**
         * Return template for option
         *
         * @deprecated
         * @returns {string}
         */
        Option.prototype.getTemplate = function () {
            return this.template;
        };
        return Option;
    }());
    exports.Option = Option;
});
