/**
 * - Options.js
 * Options for various elements
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'underscore',
    'ko'
], function (_, ko) {

    /**
     *
     * @constructor
     */
    function Options() {
        this.options = ko.observableArray([]);
    }

    /**
     * Sort the options based on their sort value
     */
    Options.prototype.sort = function () {
        this.options.sort(function (a, b) {
            return a.sort == b.sort ? 0 : (a.sort < b.sort ? -1 : 1)
        });
    };

    /**
     * Return the options template
     *
     * @returns {string}
     */
    Options.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/options.html'
    };

    /**
     * Add an option
     *
     * @param code
     * @param icon
     * @param title
     * @param callbackFn
     * @param additionalClasses
     * @param sort
     */
    Options.prototype.addOption = function (code, icon, title, callbackFn, additionalClasses, sort) {

        // If the callbackFn isn't defined return false
        if (!callbackFn || callbackFn && typeof callbackFn !== 'function') {
            callbackFn = function () { return false; };
        }

        // If the additional classes is an array, convert it into a string
        if (typeof additionalClasses === 'object' && Array.isArray(additionalClasses)) {
            additionalClasses = additionalClasses.join(' ');
        }

        this.options.push({
            code: code,
            icon: icon,
            title: title,

            /**
             * callbackFn($data, structure) receives 2 arguments
             *
             * $data - The data in the options
             * structure - The current structure block that the event was fired from
             */
            callback: callbackFn,

            additionalClasses: additionalClasses,
            sort: sort
        });

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

    return Options;
});