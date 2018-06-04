/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import alertDialog from "Magento_Ui/js/modal/alert";
import events from "uiEvents";
import _ from "underscore";
import Collection from "./collection";
import ContentTypeDroppedParamsInterface from "./content-type-dropped-params.d";
import createContentType from "./content-type-factory";
import ContentTypeInstanceDroppedParamsInterface from "./content-type-instance-dropped-params.d";
import ContentTypeRemovedParamsInterface from "./content-type-removed-params.d";
import ContentTypeSortedParamsInterface from "./content-type-sorted-params.d";
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
        // ContentType dropped from left hand panel
        events.on("contentType:dropped", (args: ContentTypeDroppedParamsInterface) => {
            if (args.stageId === this.id) {
                this.onContentTypeDropped(args);
            }
        });

        // ContentType instance being moved between structural elements
        events.on("contentType:instanceDropped", (args: ContentTypeInstanceDroppedParamsInterface) => {
            if (args.stageId === this.id) {
                this.onContentTypeInstanceDropped(args);
            }
        });

        // ContentType being removed from container
        events.on("contentType:removed", (args: ContentTypeRemovedParamsInterface) => {
            if (args.stageId === this.id) {
                this.onContentTypeRemoved(args);
            }
        });

        // ContentType sorted within the same structural element
        events.on("contentType:sorted", (args: ContentTypeSortedParamsInterface) => {
            if (args.stageId === this.id) {
                this.onContentTypeSorted(args);
            }
        });

        // Observe sorting actions
        events.on("contentType:sortStart", (args: SortParamsInterface) => {
            if (args.stageId === this.id) {
                this.onSortingStart(args);
            }
        });
        events.on("contentType:sortStop", (args: SortParamsInterface) => {
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
     * On content type removed
     *
     * @param event
     * @param params
     */
    private onContentTypeRemoved(params: ContentTypeRemovedParamsInterface): void {
        params.parent.removeChild(params.contentType);
    }

    /**
     * On instance of an existing content type is dropped onto container
     *
     * @param {ContentTypeInstanceDroppedParamsInterface} params
     */
    private onContentTypeInstanceDropped(params: ContentTypeInstanceDroppedParamsInterface): void {
        const originalParent = params.contentTypeInstance.parent;
        params.contentTypeInstance.parent = params.parent;
        params.parent.parent.addChild(params.contentTypeInstance, params.index);

        events.trigger("contentType:moved", {
            contentType: params.contentTypeInstance,
            index: params.index,
            newParent: params.parent,
            originalParent,
        });
    }

    /**
     * On content type dropped into container
     *
     * @param {ContentTypeDroppedParamsInterface} params
     */
    private onContentTypeDropped(params: ContentTypeDroppedParamsInterface) {
        const index = params.index || 0;

        new Promise<ContentTypeInterface>((resolve, reject) => {
            if (params.contentType) {
                return createContentType(params.contentType.config, params.parent, params.stageId)
                    .then((contentType: ContentTypeInterface) => {
                        params.parent.addChild(contentType, index);
                        events.trigger("contentType:dropped:create",
                            {
                                id: contentType.id,
                                contentType,
                            },
                        );
                        events.trigger(params.contentType.config.name + ":contentType:dropped:create",
                            {
                                id: contentType.id,
                                contentType,
                            },
                        );
                        return contentType;
                    });
            } else {
                reject("Parameter content type missing from event.");
            }
        }).catch((error: string) => {
            console.error(error);
        });
    }

    /**
     * On content type sorted within it's own container
     *
     * @param {ContentTypeSortedParams} params
     */
    private onContentTypeSorted(params: ContentTypeSortedParamsInterface): void {
        const originalIndex = ko.utils.arrayIndexOf(params.parent.children(), params.contentType);
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
