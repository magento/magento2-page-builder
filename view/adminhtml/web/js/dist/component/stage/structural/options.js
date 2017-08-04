define(["require", "exports", "underscore"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Options Class
     *
     * @author Dave Macaulay <dmacaulay@magento.com>
     */
    var Options = (function () {
        /**
         * Options constructor
         *
         * @param parent
         * @param options
         */
        function Options(parent, options) {
            this.options = ko.observableArray([]);
            this.template = 'Gene_BlueFoot/component/stage/structural/options.html';
            this.parent = parent;
            this.options = this.options.concat(options);
            this.sort();
        }
        /**
         * Sort the options
         */
        Options.prototype.sort = function () {
            this.options.sort(function (a, b) {
                return a.sort === b.sort ? 0 : (a.sort < b.sort ? -1 : 1);
            });
        };
        /**
         * Add an option into the options array
         *
         * @param option
         */
        Options.prototype.addOption = function (option) {
            this.options.push(option);
            this.sort();
        };
        /**
         * Remove an option
         *
         * @param code
         */
        Options.prototype.removeOption = function (code) {
            this.options(_.without(this.options(), _.findWhere(this.options(), {
                code: code
            })));
            this.sort();
        };
        /**
         * Retrieve the template
         *
         * @deprecated
         * @returns {string}
         */
        Options.prototype.getTemplate = function () {
            return this.template;
        };
        return Options;
    }());
    exports.Options = Options;
});
//# sourceMappingURL=options.js.map