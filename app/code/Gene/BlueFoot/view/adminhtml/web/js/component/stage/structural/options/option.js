/**
 * - Options.js
 * A single option for a structural block or entity
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko'
], function (ko) {

    /**
     * Constructor for option
     *
     * @param parent
     * @param code
     * @param icon
     * @param title
     * @param callbackFn
     * @param additionalClasses
     * @param sort
     * @constructor
     */
    function Option(parent, code, icon, title, callbackFn, additionalClasses, sort) {
        this.parent = parent;
        this.code = code;
        this.icon = icon;
        this.title = title;
        if (callbackFn) {
            this.callback = callbackFn;
        }
        if (additionalClasses) {
            this.additionalClasses = additionalClasses;
        }
        this.sort = sort;

        this.template = null;
    }

    /**
     * Retrieve the template from the data, if a template is not set it will fall back to an anchor
     *
     * @returns {null}
     */
    Option.prototype.getTemplate = function () {
        return this.template;
    };

    return Option;
});