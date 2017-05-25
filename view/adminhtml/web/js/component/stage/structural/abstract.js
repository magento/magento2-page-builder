/**
 * - Abstract.js
 * Abstract for the structural blocks (rows & columns)
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'underscore',
    'bluefoot/utils/array',
    'bluefoot/stage/save',
    'bluefoot/stage/structural/options',
    'mage/translate',
    'bluefoot/stage/structural/column/builder',
    'bluefoot/stage/edit',
    'mageUtils'
], function (ko, _, arrayUtil, Save, Options, $t, ColumnBuilder, Edit, utils) {

    /**
     * Abstract structural block
     *
     * @param parent
     * @param stage
     * @constructor
     */
    function AbstractStructural(parent, stage) {
        this.ns = 'bluefoot/stage/structural/abstract';

        this.parent = parent;
        this.stage = stage || false;

        this.id = utils.uniqueid();
        this.options = new Options();
        this.data = ko.observable({});

        this.children = ko.observableArray([]);

        // Observe the data & children of the current class within our save functionality
        this.stage.save.observe([this.data, this.children]);

        this.originalParent = false;
        this.originalIndex = false;

        this.wrapperStyle = ko.observable({});
        this.widthClasses = false;

        this.columnBuilder = new ColumnBuilder();

        // Build the options on initialization
        this.buildOptions();

        // Define what should be serialized within this system
        this.serializeRole = 'structural';
        this.serializeChildren = [this.children];
        this.dataEntityData = [this.data];
        this.dataEntityDataIgnore = [];

        // Init our subscriptions
        this.initSubscriptions();
    }

    /**
     * Init subscriptions on knockout observables
     */
    AbstractStructural.prototype.initSubscriptions = function () {
        this.data.subscribe(function () {
            if (this.stage) {
                this.stage.save.update();
            }
        }.bind(this));

        this.children.subscribe(function () {
            if (this.stage) {
                this.stage.save.update();
            }
        }.bind(this));
    };

    /**
     * Build up any options the structural block has
     *
     * @returns {boolean}
     */
    AbstractStructural.prototype.buildOptions = function () {
        // Add removal & move option that is available to all structural blocks
        this.options.addOption(this, 'move', '<i class="fa fa-arrows"></i>', $t('Move'), false, ['move-structural'], 10);
        this.options.addOption(this, 'edit', '<i class="fa fa-pencil"></i>', $t('Edit'), this.edit.bind(this), ['edit-block'], 50);
        this.options.addOption(this, 'duplicate', '<i class="fa fa-files-o"></i>', $t('Duplicate'), this.duplicate.bind(this), ['duplicate-structural'], 60);
        this.options.addOption(this, 'remove', '<i class="fa fa-trash"></i>', $t('Remove'), this.remove.bind(this), ['remove-structural'], 100);
    };

    /**
     * Retrieve the component duplicate instance
     *
     * @param component
     * @param callbackFn
     */
    AbstractStructural.prototype.getDuplicateInstance = function (component, callbackFn) {
        require([component.ns], function (componentInstance) {
            return callbackFn(componentInstance);
        });
    };

    /**
     * Duplicate function
     *
     * @param $data
     * @param structural
     * @param callbackFn
     */
    AbstractStructural.prototype.duplicate = function ($data, structural, callbackFn) {
        /**
         * Function constructor to allow dynamic argument passing
         *
         * @param f
         * @param args
         * @returns {*}
         */
        var construct = function(f, args) {
            var params = [f].concat(args);
            return f.bind.apply(f, params);
        };

        // Include the component by it's ns
        this.getDuplicateInstance(structural, function (Instance) {
            // Duplicate the element, use bind to dynamically pass the arguments
            var duplicate = new (construct(Instance, this.duplicateArgs()));
            this.duplicateData(duplicate);

            if (this.children().length > 0) {
                ko.utils.arrayForEach(this.children(), function (child, index) {
                    child.duplicate(false, child, function (childDuplicate) {
                        childDuplicate.parent = duplicate;
                        duplicate.addChild(childDuplicate, index);
                    });
                });
            }

            if (typeof callbackFn === 'function') {
                callbackFn(duplicate);
            } else {
                var parentChildren = this.parent.children || this.parent.stageContent,
                    newIndex = parentChildren.indexOf(this) + 1;
                this.parent.addChild(duplicate, newIndex);
            }
        }.bind(this));
    };

    /**
     * Copy data across to new instance
     *
     * @param duplicate
     * @returns {AbstractStructural}
     */
    AbstractStructural.prototype.duplicateData = function (duplicate) {
        duplicate.data(_.extend({}, this.data()));
        return this;
    };

    /**
     * Provide the arguments needed to duplicate this element
     * @returns {*[]}
     */
    AbstractStructural.prototype.duplicateArgs = function () {
        return [this.parent, this.stage];
    };

    /**
     * Edit a block
     */
    AbstractStructural.prototype.edit = function () {
        return new Edit(this);
    };

    /**
     * Return the template for the element
     *
     * @returns {string}
     */
    AbstractStructural.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/stage/structural/abstract.html'
    };

    /**
     * Return the template for the child elements
     *
     * @returns {string}
     */
    AbstractStructural.prototype.getChildTemplate = function () {
        return 'Gene_BlueFoot/component/stage/structural/children.html'
    };

    /**
     * Add a child to the current element
     *
     * @param child
     * @param index
     */
    AbstractStructural.prototype.addChild = function (child, index) {
        if (index !== undefined && index !== false) {
            // Use the arrayUtil function to add the item in the correct place within the array
            arrayUtil.moveArrayItemIntoArray(child, this.children, index);
        } else {
            this.children.push(child);
        }
    };

    /**
     * Remove a child from the children array
     *
     * @param child
     */
    AbstractStructural.prototype.removeChild = function (child) {
        utils.remove(this.children, child);
    };

    /**
     * Remove the current element
     *
     * @param $data
     * @param structural
     */
    AbstractStructural.prototype.remove = function ($data, structural) {
        this.stage.parent.confirmationDialog({
            title: 'Confirm Item Removal',
            content: 'Are you sure you want to remove this item? The data within this item is not recoverable once removed.',
            actions: {
                confirm: function(){
                    // Call the parent to remove the child element
                    structural.parent.removeChild(this);
                }.bind(this)
            }
        });
    };

    /**
     * Update the wrapper style
     *
     * @param key
     * @param value
     */
    AbstractStructural.prototype.updateWrapperStyle = function (key, value) {
        var newStyles = {};
        if (typeof key === 'object' && !value) {
            newStyles = key;
        } else {
            newStyles[key] = value;
        }
        var style = _.extend(this.wrapperStyle(), newStyles);
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
    AbstractStructural.prototype.onSortStart = function (sortableThis, event, ui, sortableInstance) {
        ui.item.show();
        ui.item.addClass('bluefoot-sorting-original');
        ui.helper.css({width: '', height: ''});

        this.originalParent = this.parent;
        this.originalIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]);
        if (this.stage) {
            this.stage.showBorders(true);
        }
    };

    /**
     * Event called when sorting stops on this element
     *
     * @param sortableThis
     * @param event
     * @param ui
     * @param sortableInstance
     */
    AbstractStructural.prototype.onSortStop = function (sortableThis, event, ui, sortableInstance) {
        ui.item.removeClass('bluefoot-sorting-original');
        if (this.stage) {
            this.stage.showBorders(false);
        }
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
    AbstractStructural.prototype.onSortUpdate = function (sortableThis, event, ui, sortableInstance) {
        var item = ui.item,
            parentEl = ui.item.parent()[0],
            newIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]),
            parent,
            childrenArray;

        if (this.stage) {
            this.stage.showBorders(false);
        }

        ui.item.removeClass('bluefoot-sorting-original');

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

                // Determine if the element has moved within the same parent, or if it's been moved into another
                if (this.originalParent.id == this.parent.id) {
                    // The element hasn't moved
                    if (this.originalIndex == newIndex) {
                        return false;
                    }
                    // Move the array item to that new index
                    arrayUtil.moveArrayItem(childrenArray, this.originalIndex, newIndex);
                } else {
                    // Remove the item from the original parent
                    this.originalParent.removeChild(this);

                    // Move the item into a different array, removing the original instance
                    arrayUtil.moveArrayItemIntoArray(this, childrenArray, newIndex);
                }

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

    /**
     * Request that parent stage add UI to the outer sidebar.
     */
    AbstractStructural.prototype.requestAddComponent = function (el, config, path) {
        if (this.stage) {
            this.stage.addComponent(el, config, path);
        }
    };

    return AbstractStructural;
});