/**
 * - Options.js
 * Options for various elements
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'underscore',
    'ko',
    'bluefoot/stage/structural/options/option',
    'mage/translate'
], function (_, ko, Option, $t) {

    /**
     * Options constructor
     *
     * @param parent
     * @constructor
     */
    function Options(parent) {
        this.parent = parent;
        this.options = ko.observableArray([]);

        this.addTitleOption();
    }

    /**
     * Add a new option to display the title
     */
    Options.prototype.addTitleOption = function () {
        this.addOption(
            'title',
            false,
            false,
            false,
            ['block-title'],
            20,
            false,
            'Gene_BlueFoot/component/stage/structural/options/title.html'
        );
    };

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
        return 'Gene_BlueFoot/component/stage/structural/options.html'
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
     * @param optionInstance
     * @param template
     */
    Options.prototype.addOption = function (code, icon, title, callbackFn, additionalClasses, sort, optionInstance, template) {

        // If the callbackFn isn't defined return false
        if (!callbackFn || callbackFn && typeof callbackFn !== 'function') {
            callbackFn = function () {
                return false;
            };
        }

        // If the additional classes is an array, convert it into a string
        if (typeof additionalClasses === 'object' && Array.isArray(additionalClasses)) {
            additionalClasses = additionalClasses.join(' ');
        }

        // If the option requires a custom option class, check the instance and use that
        var optionClass = Option;
        if (optionInstance && typeof optionInstance === 'function') {
            optionClass = optionInstance
        }

        // Create a new option instance and add it into the observable array
        this.options.push(new optionClass(this.parent, code, icon, title, callbackFn, additionalClasses, sort, template));

        // Sort the options to ensure they're in the correct order
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