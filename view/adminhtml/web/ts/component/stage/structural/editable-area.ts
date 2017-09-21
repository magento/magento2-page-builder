import EventEmitter from '../../event-emitter';
import { StageInterface } from '../../stage.d';
import { Block as BlockInterface } from '../../block/block.d';
import { Structural as StructuralInterface } from './abstract.d';
import { EditableAreaInterface } from './editable-area.d';
import createBlock from '../../block/factory';

import { moveArrayItemIntoArray, moveArrayItem, removeArrayItem } from '../../../utils/array';
import Block from '../../block/block';
import _ from 'underscore';
import ko from 'knockout';

/**
 * Class EditableArea
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class EditableArea extends EventEmitter implements EditableAreaInterface {
    children: KnockoutObservableArray<any>;
    stage: StageInterface;
    title: string = 'Editable'; // @todo translate

    /**
     * EditableArea constructor
     *
     * @param stage
     */
    constructor(stage?: StageInterface) {
        super();
        if (stage) {
            this.stage = stage;
        }

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

    /**
     * Set the children observable array into the class
     *
     * @param children
     */
    protected setChildren(children: KnockoutObservableArray<any>) {
        this.children = children;
    }

    /**
     * Retrieve the stage instance
     *
     * @returns {StageInterface}
     */
    getStage(): StageInterface {
        return this.stage;
    }

    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */
    addChild(child: StructuralInterface, index?: number) :void {
        child.parent = this;
        child.stage = this.stage;
        if (index) {
            // Use the arrayUtil function to add the item in the correct place within the array
            moveArrayItemIntoArray(child, this.children, index);
        } else {
            this.children.push(child);
        }
    }

    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    removeChild(child: any) :void {
        removeArrayItem(this.children, child);
    }

    /**
     * Handle a block being dropped into the structural element
     *
     * @param event
     * @param params
     * @returns {Promise<Block|T>}
     */
    onBlockDropped(event: Event, params: BlockDroppedParams): void {
        let index = params.index || 0;

        new Promise<BlockInterface>((resolve, reject) => {
            if (params.block) {
                return createBlock(params.block.config, this, this.stage).then((block: Block) => {
                    this.addChild(block, index);
                    resolve(block);
                    block.emit('blockReady');
                }).catch(function (error: string) {
                    reject(error);
                });
            } else {
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
    onBlockInstanceDropped(event: Event, params: BlockInstanceDroppedParams): void {
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
    onBlockRemoved(event: Event, params: BlockRemovedParams): void {
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
    onBlockSorted(event: Event, params: BlockSortedParams): void {
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
    onSortStart(event: Event, params: SortParams): void {
        let originalEle = jQuery(params.originalEle);
        originalEle.show();
        originalEle.addClass('bluefoot-sorting-original');

        // Reset the width & height of the helper
        jQuery(params.helper)
            .css({width: '', height: ''})
            .html(jQuery('<h3 />').text(this.title).html());
    }

    /**
     * Event called when sorting stops on this element
     *
     * @param event
     * @param params
     */
    onSortStop(event: Event, params: SortParams): void {
        jQuery(params.originalEle).removeClass('bluefoot-sorting-original');
    }
}

export interface BlockDroppedParams {
    index: number,
    block: {
        config: object
    }
}

export interface BlockInstanceDroppedParams {
    blockInstance: Block,
    index?: number
}

export interface BlockRemovedParams {
    block: Block
}

export interface BlockSortedParams {
    block: Block
    index: number
}

export interface SortParams {
    originalEle: JQuery
    placeholder: JQuery
    helper?: any
}