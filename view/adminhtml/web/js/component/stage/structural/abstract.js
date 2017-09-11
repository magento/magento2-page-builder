/**
 * - Abstract.js
 * Abstract for the structural blocks (rows & columns)
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/stage/structural/editable-area',
    'ko',
    'underscore',
    'bluefoot/utils/array',
    'bluefoot/stage/save',
    'bluefoot/stage/structural/options',
    'mage/translate',
    'bluefoot/stage/structural/column/builder',
    'bluefoot/stage/edit',
    'mageUtils'
], function (EditableArea, ko, _, arrayUtil, Save, Options, $t, ColumnBuilder, Edit, utils) {

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

        this.id = utils.uniqueid();
        this.options = new Options();
        this.data = ko.observable({});
        this.children = ko.observableArray([]);

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

        // All structural elements are editable
        EditableArea.call(this, this.children, stage);

        // Observe the data & children of the current class within our save functionality
        this.stage.save.observe([this.data, this.children]);
    }
    AbstractStructural.prototype = Object.create(EditableArea.prototype);

    /**
     * Init subscriptions on knockout observables
     */
    AbstractStructural.prototype.initSubscriptions = function () {
        var saveStage = function saveStage() {
            if (this.stage) {
                this.stage.save.update();
            }
        }.bind(this);

        this.data.subscribe(saveStage);
        this.children.subscribe(saveStage);
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
                _.defer(callbackFn, duplicate);
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
                    structural.parent.emit('blockRemoved', {
                        block: this
                    });
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
     * Request that parent stage add UI to the outer sidebar.
     */
    AbstractStructural.prototype.requestAddComponent = function (el, config, path) {
        if (this.stage) {
            this.stage.addComponent(el, config, path);
        }
    };

    return AbstractStructural;
});