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
     * Abstract structural block
     *
     * @param parent
     * @param stage
     * @constructor
     */
    function Abstract(parent, stage) {
        this.id = this.guid();
        this.options = new Options();
        this.data = ko.observableArray([]);
        this.children = ko.observableArray([]);

        this.parent = parent;
        this.stage = stage;

        // Build the options on initialization
        this.buildOptions();
    }

    /**
     * Generate a GUID
     *
     * @returns {string}
     */
    Abstract.prototype.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    /**
     * Build up any options the structural block has
     *
     * @returns {boolean}
     */
    Abstract.prototype.buildOptions = function () {
        // Add removal & move option that is available to all structural blocks
        this.options.addOption('move', '<i class="fa fa-arrows"></i>', $t('Move'), false, ['move-structural'], 10);
        this.options.addOption('remove', '<i class="fa fa-trash"></i>', $t('Remove'), this.remove.bind(this), ['remove-structural'], 100);
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
     * Remove a child from the children array
     *
     * @param child
     */
    Abstract.prototype.removeChild = function (child) {
        this.children(ko.utils.arrayFilter(this.children(), function(filterChild) {
            return child.id != filterChild.id;
        }));
    };

    /**
     * Remove the current element
     *
     * @param $data
     * @param structural
     * @param parent
     */
    Abstract.prototype.remove = function ($data, structural) {
        // Call the parent to remove the child element
        structural.parent.removeChild(this);
    };

    return Abstract;
});