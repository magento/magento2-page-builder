/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import alertDialog from "Magento_Ui/js/modal/alert";
import events from "uiEvents";
import _ from "underscore";
import ContentTypeDroppedParamsInterface from "./content-type-dropped-params.d";
import ContentTypeInstanceDroppedParamsInterface from "./content-type-instance-dropped-params.d";
import ContentTypeRemovedParamsInterface from "./content-type-removed-params.d";
import ContentTypeSortedParamsInterface from "./content-type-sorted-params.d";
import Collection from "./collection";
import createContentType from "./content-type-factory";
import ContentTypeInterface from "./content-type.d";
import DataStore from "./data-store";
import Render from "./master-format/render";
import PageBuilderInterface from "./page-builder.d";
import SortParamsInterface from "./sort-params.d";
import buildStage from "./stage-builder";
import {moveArrayItem} from "./utils/array";

export default class Stage {
    public parent: PageBuilderInterface;
    public id: string;
    public config: {} = {name: "stage"};
    public loading: KnockoutObservable<boolean> = ko.observable(true);
    public showBorders: KnockoutObservable<boolean> = ko.observable(false);
    public interacting: KnockoutObservable<boolean> = ko.observable(false);
    public userSelect: KnockoutObservable<boolean> = ko.observable(true);
    public stageLoadingMessage: string = $t("Please hold! we're just retrieving your content...");
    public dataStore: DataStore = new DataStore();
    private template: string = "Magento_PageBuilder/content-type/preview";
    private render: Render = new Render();
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
        events.trigger(`stage:ready:${ this.id }`, {stage: this});
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
            () => events.trigger("stage:updated", {stageId: this.id}),
        );
        // Block dropped from left hand panel
        events.on("block:dropped", (args: ContentTypeDroppedParamsInterface) => {
            if (args.stageId === this.id) {
                this.onBlockDropped(args);
            }
        });

        // Block instance being moved between structural elements
        events.on("block:instanceDropped", (args: ContentTypeInstanceDroppedParamsInterface) => {
            if (args.stageId === this.id) {
                this.onBlockInstanceDropped(args);
            }
        });

        // Block being removed from container
        events.on("block:removed", (args: ContentTypeRemovedParamsInterface) => {
            if (args.stageId === this.id) {
                this.onBlockRemoved(args);
            }
        });

        // Block sorted within the same structural element
        events.on("block:sorted", (args: ContentTypeSortedParamsInterface) => {
            if (args.stageId === this.id) {
                this.onBlockSorted(args);
            }
        });

        // Observe sorting actions
        events.on("block:sortStart", (args: SortParamsInterface) => {
            if (args.stageId === this.id) {
                this.onSortingStart(args);
            }
        });
        events.on("block:sortStop", (args: SortParamsInterface) => {
            if (args.stageId === this.id) {
                this.onSortingStop(args);
            }
        });

        // Any store state changes trigger a stage update event
        this.dataStore.subscribe(() => events.trigger("stage:updated", {stageId: this.id}));

        // Watch for stage update events & manipulations to the store, debounce for 50ms as multiple stage changes
        // can occur concurrently.
        events.on("stage:updated", (args) => {
            if (args.stageId === this.id) {
                _.debounce(() => {
                    this.render.applyBindings(this.children)
                        .then((renderedOutput) => events.trigger(`stage:renderTree:${ this.id }`, {
                            value: renderedOutput,
                        }));
                }, 500).call(this);
            }
        });

        events.on("interaction:start", () => this.interacting(true));
        events.on("interaction:stop", () => this.interacting(false));
    }

    /**
     * On block removed
     *
     * @param event
     * @param params
     */
    private onBlockRemoved(params: ContentTypeRemovedParamsInterface): void {
        params.parent.removeChild(params.block);
    }

    /**
     * On instance of an existing block is dropped onto container
     *
     * @param {Event} event
     * @param {BlockInstanceDroppedParams} params
     */
    private onBlockInstanceDropped(params: ContentTypeInstanceDroppedParamsInterface): void {
        const originalParent = params.blockInstance.parent;
        params.blockInstance.parent = params.parent;
        params.parent.parent.addChild(params.blockInstance, params.index);

        events.trigger("block:moved", {
            block: params.blockInstance,
            index: params.index,
            newParent: params.parent,
            originalParent,
        });
    }

    /**
     * On block dropped into container
     *
     * @param {BlockDroppedParams} params
     */
    private onBlockDropped(params: ContentTypeDroppedParamsInterface) {
        const index = params.index || 0;

        new Promise<ContentTypeInterface>((resolve, reject) => {
            if (params.block) {
                return createContentType(params.block.config, params.parent, params.stageId)
                    .then((block: ContentTypeInterface) => {
                        params.parent.addChild(block, index);
                        events.trigger("block:dropped:create", {id: block.id, block});
                        events.trigger(params.block.config.name + ":block:dropped:create", {id: block.id, block});
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
     * @param {BlockSortedParams} params
     */
    private onBlockSorted(params: ContentTypeSortedParamsInterface): void {
        const originalIndex = ko.utils.arrayIndexOf(params.parent.children(), params.block);
        if (originalIndex !== params.index) {
            moveArrayItem(params.parent.children, originalIndex, params.index);
        }
    }

    /**
     * On sorting start
     *
     * @param {SortParamsInterface} params
     */
    private onSortingStart(params: SortParamsInterface): void {
        this.showBorders(true);
    }

    /**
     * On sorting stop
     *
     * @param {SortParamsInterface} params
     */
    private onSortingStop(params: SortParamsInterface): void {
        this.showBorders(false);
    }
}
