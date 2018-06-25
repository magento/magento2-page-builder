/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import "Magento_PageBuilder/js/resource/jquery/ui/jquery.ui.touch-punch.min";
import alertDialog from "Magento_Ui/js/modal/alert";
import events from "uiEvents";
import _ from "underscore";
import ContentTypeRemovedParamsInterface from "./content-type-removed-params.d";
import ContentTypeInterface from "./content-type.d";
import {generateAllowedParents} from "./drag-drop/matrix";
import {getSortableOptions} from "./drag-drop/sortable";
import PageBuilderInterface from "./page-builder.d";
import buildStage from "./stage-builder";

/**
 * @api
 */
export default class Stage {
    public parent: PageBuilderInterface;
    public id: string;
    public config: ContentTypeConfigInterface | any = {
        name: "stage",
        type: "restricted-container",
        accepts: [
            "row",
        ],
    };
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
        generateAllowedParents();
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
     * Determine if the container can receive drop events?
     *
     * @returns {boolean}
     */
    public isContainer() {
        return true;
    }

    /**
     * Return the sortable options
     *
     * @returns {JQueryUI.SortableOptions}
     */
    public getSortableOptions(): JQueryUI.SortableOptions | any {
        return getSortableOptions(this);
    }

    /**
     * Init listeners
     */
    protected initListeners() {
        this.collection.getChildren().subscribe(
            () => events.trigger("stage:updated", {stageId: this.id}),
        );

        // ContentType being removed from container
        events.on("contentType:removed", (args: ContentTypeRemovedParamsInterface) => {
            if (args.stageId === this.id) {
                this.onContentTypeRemoved(args);
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
     * @param params
     */
    private onContentTypeRemoved(params: ContentTypeRemovedParamsInterface): void {
        params.parent.removeChild(params.contentType);
    }
}
