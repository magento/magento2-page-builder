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
     */
    Options.prototype.addOption = function (code, icon, title, callbackFn) {
        this.options.push({
            code: code,
            icon: icon,
            title: title,
            callback: callbackFn
        })
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
    };

    return Options;
});