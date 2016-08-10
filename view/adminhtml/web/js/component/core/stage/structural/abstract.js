/**
 * - Abstract.js
 * Abstract for the structural blocks (rows & columns)
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/structural/options',
    'mage/translate'
], function (ko, Options, $t) {

    /**
     *
     * @constructor
     */
    function Abstract() {
        this.options = new Options();
        this.data = ko.observableArray([]);
        this.children = ko.observableArray([]);

        // Build the options on initialization
        this.buildOptions();
    }

    /**
     * Build up any options the structural block has
     *
     * @returns {boolean}
     */
    Abstract.prototype.buildOptions = function () {
        console.log(this);
        // Add removal option that is available to all structural blocks
        this.options.addOption('remove', '<i class="fa fa-trash"></i>', $t('Remove'), this.remove.bind(this));
    };

    /**
     * Return the template for the element
     *
     * @returns {string}
     */
    Abstract.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/abstract.html'
    };

    /**
     * Return the template for the child elements
     *
     * @returns {string}
     */
    Abstract.prototype.getChildTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/children.html'
    };

    /**
     * Remove the current element
     */
    Abstract.prototype.remove = function () {
        console.log('Remove');
    };

    return Abstract;
});