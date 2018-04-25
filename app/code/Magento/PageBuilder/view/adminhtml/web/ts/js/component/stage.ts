/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import alertDialog from "Magento_Ui/js/modal/alert";
import _ from "underscore";
import Collection from "../collection";
import createContentType from "../content-type-factory";
import ContentTypeInterface from "../content-type.d";
import {moveArrayItem} from "../utils/array";
import BlockDroppedParamsInterface from "./block-dropped-params.d.ts";
import BlockInstanceDroppedParamsInterface from "./block-instance-dropped-params.d.ts";
import BlockRemovedParamsInterface from "./block-removed-params.d";
import BlockSortedParamsInterface from "./block-sorted-params.d";
import DataStore from "./data-store";
import EventBus from "./event-bus";
import PageBuilderInterface from "./page-builder.d";
import SortParamsInterface from "./sort-params.d.ts";
import buildStage from "./stage-builder";
import MasterFormatRenderer from "./stage/master-format-renderer";

export default class Stage {
    public parent: PageBuilderInterface;
    public id: string;
    public config: {} = {name: "stage"};
    public loading: KnockoutObservable<boolean> = ko.observable(true);
    public showBorders: KnockoutObservable<boolean> = ko.observable(false);
    public interacting: KnockoutObservable<boolean> = ko.observable(false);
    public userSelect: KnockoutObservable<boolean> = ko.observable(true);
    public stageLoadingMessage: string = $t("Please hold! we're just retrieving your content...");
    public store: DataStore = new DataStore();
    private template: string = "Magento_PageBuilder/component/stage.html";
    private masterFormatRenderer: MasterFormatRenderer = new MasterFormatRenderer();
    private collection: Collection = new Collection();

    /**
     * @param {PageBuilderInterface} parent
     */
    constructor(parent: PageBuilderInterface) {
        this.parent = parent;
        this.id = parent.id;
        this.initListeners();
        buildStage(this, parent.initialValue).then(this.ready.bind(this));
    }

    /**
     * Get template.
     *
     * @returns {string}
     */
    public getTemplate() {
        return this.template;
    }

    /**
     * The stage has been initiated fully and is ready
     */
    public ready() {
        EventBus.trigger(`stage:ready:${ this.id }`, {stage: this});
        this.collection.getChildren().valueHasMutated();
        this.loading(false);
    }

    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    public removeChild(child: any): void {
        if (this.collection.getChildren().length === 1) {
            alertDialog({
                content: $t("You are not able to remove the final row from the content."),
                title: $t("Unable to Remove"),
            });
            return;
        }
        this.collection.removeChild(child);
    }

    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<ContentTypeInterface>}
     */
    public getChildren(): KnockoutObservableArray<ContentTypeInterface> {
        return this.collection.getChildren();
    }

    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */
    public addChild(child: ContentTypeInterface, index?: number): void {
        child.parent = this;
        this.collection.addChild(child, index);
    }

    /**
     * Set the children observable array into the class
     *
     * @param children
     */
    public setChildren(children: KnockoutObservableArray<ContentTypeInterface>) {
        this.collection.setChildren(children);
    }

    get children() {
        return this.collection.getChildren();
    }

    /**
     * Init listeners
     */
    protected initListeners() {
        this.collection.getChildren().subscribe(
            () => EventBus.trigger("stage:updated", {stageId: this.id}),
        );
        // Block dropped from left hand panel
        EventBus.on("block:dropped", (event, params: BlockDroppedParamsInterface) => {
            if (params.stageId === this.id) {
                this.onBlockDropped(event, params);
            }
        });

        // Block instance being moved between structural elements
        EventBus.on("block:instanceDropped", (event, params: BlockInstanceDroppedParamsInterface) => {
            if (params.stageId === this.id) {
                this.onBlockInstanceDropped(event, params);
            }
        });

        // Block being removed from container
        EventBus.on("block:removed", (event, params: BlockRemovedParamsInterface) => {
            if (params.stageId === this.id) {
                this.onBlockRemoved(event, params);
            }
        });

        // Block sorted within the same structural element
        EventBus.on("block:sorted", (event, params: BlockSortedParamsInterface) => {
            if (params.stageId === this.id) {
                this.onBlockSorted(event, params);
            }
        });

        // Observe sorting actions
        EventBus.on("block:sortStart", (event, params: SortParamsInterface) => {
            if (params.stageId === this.id) {
                this.onSortingStart(event, params);
            }
        });
        EventBus.on("block:sortStop", (event, params: SortParamsInterface) => {
            if (params.stageId === this.id) {
                this.onSortingStop(event, params);
            }
        });

        // Any store state changes trigger a stage update event
        this.store.subscribe(() => EventBus.trigger("stage:updated", {stageId: this.id}));

        // Watch for stage update events & manipulations to the store, debounce for 50ms as multiple stage changes
        // can occur concurrently.
        EventBus.on("stage:updated", (event, params) => {
            if (params.stageId === this.id) {
                _.debounce(() => {
                    this.masterFormatRenderer.applyBindings(this.children)
                        .then((renderedOutput) => EventBus.trigger(`stage:renderTree:${ this.id }`, {
                            value: renderedOutput,
                        }));
                }, 500).call(this);
            }
        });

        EventBus.on("interaction:start", () => this.interacting(true));
        EventBus.on("interaction:stop", () => this.interacting(false));
    }

    /**
     * On block removed
     *
     * @param event
     * @param params
     */
    private onBlockRemoved(event: Event, params: BlockRemovedParamsInterface): void {
        params.parent.removeChild(params.block);

        // Remove the instance from the data store
        params.parent.store.remove(params.block.id);
    }

    /**
     * On instance of an existing block is dropped onto container
     *
     * @param {Event} event
     * @param {BlockInstanceDroppedParams} params
     */
    private onBlockInstanceDropped(event: Event, params: BlockInstanceDroppedParamsInterface): void {
        const originalParent = params.blockInstance.parent;
        params.blockInstance.parent = params.parent;
        params.parent.parent.addChild(params.blockInstance, params.index);

        EventBus.trigger("block:moved", {
            block: params.blockInstance,
            index: params.index,
            newParent: params.parent,
            originalParent,
        });
    }

    /**
     * On block dropped into container
     *
     * @param {Event} event
     * @param {BlockDroppedParams} params
     */
    private onBlockDropped(event: Event, params: BlockDroppedParamsInterface) {
        const index = params.index || 0;

        new Promise<ContentTypeInterface>((resolve, reject) => {
            if (params.block) {
                return createContentType(params.block.config, params.parent, params.stageId)
                    .then((block: ContentTypeInterface) => {
                        params.parent.addChild(block, index);
                        EventBus.trigger("block:dropped:create", {id: block.id, block});
                        EventBus.trigger(params.block.config.name + ":block:dropped:create", {id: block.id, block});
                        return block;
                    });
            } else {
                reject("Parameter block missing from event.");
            }
        }).catch((error: string) => {
            console.error(error);
        });
    }

    /**
     * On block sorted within it's own container
     *
     * @param {Event} event
     * @param {BlockSortedParams} params
     */
    private onBlockSorted(event: Event, params: BlockSortedParamsInterface): void {
        const originalIndex = ko.utils.arrayIndexOf(params.parent.children(), params.block);
        if (originalIndex !== params.index) {
            moveArrayItem(params.parent.children, originalIndex, params.index);
        }
    }

    /**
     * On sorting start
     *
     * @param {Event} event
     * @param {SortParamsInterface} params
     */
    private onSortingStart(event: Event, params: SortParamsInterface): void {
        this.showBorders(true);
    }

    /**
     * On sorting stop
     *
     * @param {Event} event
     * @param {SortParamsInterface} params
     */
    private onSortingStop(event: Event, params: SortParamsInterface): void {
        this.showBorders(false);
    }
}
