import EventEmitter from '../../event-emitter';
import Stage from '../../stage';
import { Block as BlockInterface } from '../../block/block.d';
import Structural from './abstract';
import { EditableAreaInterface } from './editable-area.d';
import createBlock from '../../block/factory';
import StyleAttributeFilter from "../../stage/style-attribute-filter";
import DomAttributeMapper from "../../../utils/dom-attribute-mapper";

import { moveArrayItemIntoArray, moveArrayItem, removeArrayItem } from '../../../utils/array';
import Block from '../../block/block';
import _ from 'underscore';
import ko from 'knockout';

import mageUtils from 'mageUtils';
import $t from 'mage/translate';

/**
 * Class EditableArea
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class EditableArea extends EventEmitter implements EditableAreaInterface {
    id: string = mageUtils.uniqueid();
    children: KnockoutObservableArray<Structural>;
    stage: Stage;
    title: string = $t('Editable');
    styleAttributeFilter: StyleAttributeFilter;
    domAttributeMapper: DomAttributeMapper;

    /**
     * EditableArea constructor
     *
     * @param stage
     */
    constructor(stage?: Stage) {
        super();
        this.styleAttributeFilter = new StyleAttributeFilter();
        this.domAttributeMapper = new DomAttributeMapper();
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
    protected setChildren(children: KnockoutObservableArray<Structural>) {
        this.children = children;

        // Attach a subscription to the children of every editable area to fire the stageUpdated event
        children.subscribe(() => this.stage.emit('stageUpdated'));
    }

    /**
     * Duplicate a child of the current instance
     *
     * @param {Structural} child
     * @param {boolean} autoAppend
     * @returns {Structural}
     */
    duplicateChild(child: Structural, autoAppend: boolean = true): Structural {
        const store = this.stage.store,
            instance = child.constructor as typeof Structural,
            duplicate = new instance(child.parent, child.stage, child.config),
            index = child.parent.children.indexOf(child) + 1 || null;

        // Copy the data from the data store
        store.update(
            duplicate.id, 
            Object.assign({}, store.get(child.id))
        );

        // Duplicate the instances children into the new duplicate
        if (child.children().length > 0) {
            child.children().forEach((subChild: Structural, index: number) => {
                duplicate.addChild(
                    duplicate.duplicateChild(subChild, false),
                    index
                );
            });
        }

        if (autoAppend) {
            this.addChild(duplicate, index);
        }
        return duplicate;
    }

    /**
     * Retrieve the stage instance
     *
     * @returns {Stage}
     */
    getStage(): Stage {
        return this.stage;
    }

    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */
    addChild(child: Structural, index?: number) :void {
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

        // Remove the instance from the data store
        this.stage.store.remove(this.id);

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

    /**
     * @returns {object}
     */
    getCss() {
        let cssClasses = {};
        if ('css_classes' in this.getData()) {
            this.getData().css_classes.map((value, index) => cssClasses[value] = true);
        }
        return cssClasses;
    }

    /**
     * @returns {object}
     */
    getStyle() {
        return this.styleAttributeFilter.filter(this.getData());
    }

    // /**
    //  * @returns {object}
    //  */
    // getAttributes() {
    //     let attributes: any = {};
    //     let data = this.getData();
    //     Object.keys(data).map(
    //         function (key: any) {
    //             if (['role', 'appearance'].includes(key)) {
    //                 attributes[key] = data[key];
    //             }
    //         }
    //     );
    //     return this.domAttributeMapper.toDom(attributes);
    // }

    /**
     * @returns {object}
     */
    getData() {
        return this.stage.store.get(this.id);
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