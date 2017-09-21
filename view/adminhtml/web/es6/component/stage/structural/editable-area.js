import EventEmitter from '../../event-emitter';
import createBlock from '../../block/factory';
import { moveArrayItemIntoArray, moveArrayItem, removeArrayItem } from '../../../utils/array';
/**
 * Class EditableArea
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class EditableArea extends EventEmitter {
    /**
     * EditableArea constructor
     *
     * @param stage
     */
    constructor(stage) {
        super();
        this.title = 'Editable'; // @todo translate
        if (stage) {
            this.stage = stage;
        }
        // Bind this context to event handlers
        this.onBlockDropped = this.onBlockDropped.bind(this);
        this.onBlockInstanceDropped = this.onBlockInstanceDropped.bind(this);
        this.onBlockRemoved = this.onBlockRemoved.bind(this);
        this.onBlockSorted = this.onBlockSorted.bind(this);
        this.onSortStart = this.onSortStart.bind(this);
        this.onSortStop = this.onSortStop.bind(this);
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
    /**
     * Set the children observable array into the class
     *
     * @param children
     */
    setChildren(children) {
        this.children = children;
    }
    /**
     * Retrieve the stage instance
     *
     * @returns {StageInterface}
     */
    getStage() {
        return this.stage;
    }
    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */
    addChild(child, index) {
        child.parent = this;
        child.stage = this.stage;
        if (index) {
            // Use the arrayUtil function to add the item in the correct place within the array
            moveArrayItemIntoArray(child, this.children, index);
        }
        else {
            this.children.push(child);
        }
    }
    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    removeChild(child) {
        removeArrayItem(this.children, child);
    }
    /**
     * Handle a block being dropped into the structural element
     *
     * @param event
     * @param params
     * @returns {Promise<Block|T>}
     */
    onBlockDropped(event, params) {
        let index = params.index || 0;
        new Promise((resolve, reject) => {
            if (params.block) {
                return createBlock(params.block.config, this, this.stage).then((block) => {
                    this.addChild(block, index);
                    resolve(block);
                    block.emit('blockReady');
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                reject('Parameter block missing from event.');
            }
        }).catch(function (error) {
            console.error(error);
        });
    }
    /**
     * Capture a block instance being dropped onto this element
     *
     * @param event
     * @param params
     */
    onBlockInstanceDropped(event, params) {
        this.addChild(params.blockInstance, params.index);
        /*
        if (ko.processAllDeferredBindingUpdates) {
            ko.processAllDeferredBindingUpdates();
        }*/
        params.blockInstance.emit('blockMoved');
    }
    /**
     * Handle event to remove block
     *
     * @param event
     * @param params
     */
    onBlockRemoved(event, params) {
        params.block.emit('blockBeforeRemoved');
        this.removeChild(params.block);
        /*
        if (ko.processAllDeferredBindingUpdates) {
            ko.processAllDeferredBindingUpdates();
        }*/
    }
    /**
     * Handle event when a block is sorted within it's current container
     *
     * @param event
     * @param params
     */
    onBlockSorted(event, params) {
        let originalIndex = ko.utils.arrayIndexOf(this.children(), params.block);
        if (originalIndex !== params.index) {
            moveArrayItem(this.children, originalIndex, params.index);
        }
        params.block.emit('blockMoved');
    }
    /**
     * Event called when starting starts on this element
     *
     * @param event
     * @param params
     */
    onSortStart(event, params) {
        let originalEle = jQuery(params.originalEle);
        originalEle.show();
        originalEle.addClass('bluefoot-sorting-original');
        // Reset the width & height of the helper
        jQuery(params.helper)
            .css({ width: '', height: '' })
            .html(jQuery('<h3 />').text(this.title).html());
    }
    /**
     * Event called when sorting stops on this element
     *
     * @param event
     * @param params
     */
    onSortStop(event, params) {
        jQuery(params.originalEle).removeClass('bluefoot-sorting-original');
    }
}
