/**
 * - editable-area.js
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/event-emitter',
    'ko',
    'underscore',
    'bluefoot/utils/array',
    'bluefoot/block/factory',
    'bluefoot/stage',
    'mageUtils'
], function (EventEmitter, ko, _, arrayUtil, BlockFactory, Stage, utils) {

    /**
     * EditableArea constructor
     *
     * @constructor
     */
    function EditableArea(childrenObservable, stage) {
        if (!ko.isObservable(childrenObservable)) {
            throw new Error('EditableArea must be passed the child\'s observable children array as the first argument.');
        }
        this.childrenObservable = childrenObservable;

        // Ensure the editable area is aware of it's stage
        if (typeof stage === 'undefined') {
            throw new Error('EditableArea must have a reference to stage as it\'s second argument.');
        }
        this.stage = stage;

        EventEmitter.apply(this, arguments);

        // Bind this context to event handlers
        _.bindAll(
            this,
            'onBlockDropped',
            'onBlockInstanceDropped',
            'onBlockRemoved',
            'onBlockSorted',
            'onSortStart',
            'onSortStop'
        );

        // Attach events to structural elements
        // Block dropped from left hand panel
        this.on('blockDropped', this.onBlockDropped);

        // Block instance being moved between structural elements
        this.on('blockInstanceDropped', this.onBlockInstanceDropped);
        this.on('blockRemoved', this.onBlockRemoved);

        // Block sorted within the same structural element
        this.on('blockSorted', this.onBlockSorted);

        this.on('sortStart', this.onSortStart);
        this.on('sortStop', this.onSortStop);
    }
    EditableArea.prototype = Object.create(EventEmitter.prototype);

    /**
     * Add a child to the current element
     *
     * @param child
     * @param index
     */
    EditableArea.prototype.addChild = function (child, index) {
        child.parent = this;
        child.stage = this.stage;
        if (index !== undefined && index !== false) {
            // Use the arrayUtil function to add the item in the correct place within the array
            arrayUtil.moveArrayItemIntoArray(child, this.childrenObservable, index);
        } else {
            this.childrenObservable.push(child);
        }
    };

    /**
     * Remove a child from the children array
     *
     * @param child
     */
    EditableArea.prototype.removeChild = function (child) {
        utils.remove(this.childrenObservable, child);
    };

    /**
     * Handle a block being dropped into the structural element
     *
     * @param event
     * @param params
     * @returns {*}
     */
    EditableArea.prototype.onBlockDropped = function (event, params) {
        var self = this,
            index = params.index || 0;
        return new Promise(function (resolve, reject) {
            if (params.block) {
                var blockFactory = new BlockFactory();
                blockFactory.create(params.block.config, self, self.stage).then(function (block) {
                    self.addChild(block, index);
                    resolve(block);
                    block.emit('blockReady');
                }).catch(function (error) {
                    reject(error);
                });
            } else {
                reject('Parameter block missing from event.');
            }
        }).catch(function (error) {
            console.error(error);
        });
    };

    /**
     * Capture a block instance being dropped onto this element
     *
     * @param event
     * @param params
     */
    EditableArea.prototype.onBlockInstanceDropped = function (event, params) {
        this.addChild(params.blockInstance, params.index);

        if (ko.processAllDeferredBindingUpdates) {
            ko.processAllDeferredBindingUpdates();
        }

        params.blockInstance.emit('blockMoved');
    };

    /**
     * Handle event to remove block
     *
     * @param event
     * @param params
     */
    EditableArea.prototype.onBlockRemoved = function (event, params) {
        params.block.emit('blockBeforeRemoved');
        this.removeChild(params.block);

        if (ko.processAllDeferredBindingUpdates) {
            ko.processAllDeferredBindingUpdates();
        }
    };

    /**
     * Handle event when a block is sorted within it's current container
     *
     * @param event
     * @param params
     */
    EditableArea.prototype.onBlockSorted = function (event, params) {
        var originalIndex = ko.utils.arrayIndexOf(this.childrenObservable(), params.block);
        if (originalIndex !== params.index) {
            arrayUtil.moveArrayItem(this.childrenObservable, originalIndex, params.index);
        }
        params.block.emit('blockMoved');
    };

    /**
     * Event called when starting starts on this element
     *
     * @param event
     * @param params
     */
    EditableArea.prototype.onSortStart = function (event, params) {
        var originalEle = jQuery(params.originalEle);
        originalEle.show();
        originalEle.addClass('bluefoot-sorting-original');

        // Reset the width & height of the helper
        jQuery(params.helper).css({width: '', height: ''});
    };

    /**
     * Event called when sorting stops on this element
     *
     * @param event
     * @param params
     */
    EditableArea.prototype.onSortStop = function (event, params) {
        jQuery(params.originalEle).removeClass('bluefoot-sorting-original');
    };

    return EditableArea;
});