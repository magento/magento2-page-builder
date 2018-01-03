/**
 * - Options.js
 * A single option for a structural block or entity
 *
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
     * @param template
     * @constructor
     */
    function Option(parent, code, icon, title, callbackFn, additionalClasses, sort, template) {
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

        this.template = template || null;
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