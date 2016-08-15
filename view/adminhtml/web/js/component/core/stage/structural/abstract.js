/**
 * - Abstract.js
 * Abstract for the structural blocks (rows & columns)
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'underscore',
    'bluefoot/common',
    'bluefoot/stage/structural/options',
    'mage/translate'
], function (ko, _, Common, Options, $t) {

    /**
     * Abstract structural block
     *
     * @param parent
     * @param stage
     * @constructor
     */
    function Abstract(parent, stage) {
        this.id = Common.guid();
        this.options = new Options();
        this.data = ko.observableArray([]);
        this.children = ko.observableArray([]);

        this.originalParent = false;
        this.originalIndex = false;

        this.parent = parent;
        this.stage = stage;

        this.wrapperStyle = ko.observable({});

        // Build the options on initialization
        this.buildOptions();
    }

    /**
     * Build up any options the structural block has
     *
     * @returns {boolean}
     */
    Abstract.prototype.buildOptions = function () {
        // Add removal & move option that is available to all structural blocks
        this.options.addOption(this, 'move', '<i class="fa fa-arrows"></i>', $t('Move'), false, ['move-structural'], 10);
        this.options.addOption(this, 'remove', '<i class="fa fa-trash"></i>', $t('Remove'), this.remove.bind(this), ['remove-structural'], 100);
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
        this.refreshChildren();
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

    /**
     * Refresh children within stage
     */
    Abstract.prototype.refreshChildren = function () {
        var data = this.children().slice(0);
        this.children([]);
        this.children(data);
    };

    /**
     * Update the wrapper style
     *
     * @param key
     * @param value
     */
    Abstract.prototype.updateWrapperStyle = function (key, value) {
        var newStyles = {};
        if (typeof key === 'object' && !value) {
            newStyles = key;
        } else {
            newStyles[key] = value;
        }
        var style = _.extend(this.wrapperStyle(), newStyles);
        console.log(style);
        this.wrapperStyle(style);
    };

    /**
     * Event called when sorting starts on this element
     *
     * @param sortableThis
     * @param event
     * @param ui
     * @param sortableInstance
     */
    Abstract.prototype.onSortStart = function (sortableThis, event, ui, sortableInstance) {
        this.originalParent = this.parent;
        this.originalIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]);
    };

    /**
     * Function called on sort updating
     *
     * @param sortableThis
     * @param event
     * @param ui
     * @param sortableInstance
     * @returns {boolean}
     */
    Abstract.prototype.onSortUpdate = function (sortableThis, event, ui, sortableInstance) {
        var item = ui.item,
            parentEl = ui.item.parent()[0],
            newIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]),
            parent,
            childrenArray;

        // Only run the event once
        if (item && (sortableThis === parentEl)) {

            // Rows are a parent of the stage which stores it's data slightly differently
            if (item.hasClass('bluefoot-row-wrapper')) {
                var parentUiClass = ko.dataFor(item.parents('.bluefoot-canvas')[0]);
                parent = parentUiClass.stage;
                childrenArray = parentUiClass.stageContent;
            } else {
                parent = ko.dataFor(item.parents('.bluefoot-structure')[0]);
                childrenArray = parent.children;
            }

            // Verify we have a parent element
            if (parent) {
                // Update the elements parent
                this.parent = parent;

                // Cancel original sortable event, allowing KO to handle DOM manipulation
                jQuery(sortableThis).sortable('cancel');

                // Determine if the element has moved within the same parent, or if it's been moved into another
                if (this.originalParent.id == this.parent.id) {
                    // The element hasn't moved
                    if (this.originalIndex == newIndex) {
                        return false;
                    }
                    // Move the array item to that new index
                    Common.moveArrayItem(childrenArray, this.originalIndex, newIndex);
                } else {
                    // Remove the item from the original parent
                    this.originalParent.removeChild(this);
                    this.originalParent.refreshChildren();

                    // Move the item into a different array, removing the original instance
                    Common.moveArrayItemIntoArray(this, childrenArray, newIndex);
                }

                // Force refresh the children to update the UI
                parent.refreshChildren();

                // Remove the item from the UI
                item.remove();
            }

            // If using deferred updates plugin, force updates
            if (ko.processAllDeferredBindingUpdates) {
                ko.processAllDeferredBindingUpdates();
            }

            // Reset and tidy up
            this.originalParent = false;
            this.originalIndex = false;

        }
    };

    return Abstract;
});