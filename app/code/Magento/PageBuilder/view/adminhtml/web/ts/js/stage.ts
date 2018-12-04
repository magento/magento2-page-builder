/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import "Magento_PageBuilder/js/resource/jquery/ui/jquery.ui.touch-punch";
import alertDialog from "Magento_Ui/js/modal/alert";
import _ from "underscore";
import "./binding/sortable";
import Collection from "./collection";
import ContentTypeConfigInterface from "./content-type-config";
import ContentTypeRemovedParamsInterface from "./content-type-removed-params.d";
import ContentTypeInterface from "./content-type.d";
import DataStore from "./data-store";
import {generateAllowedParents} from "./drag-drop/matrix";
import {getSortableOptions} from "./drag-drop/sortable";
import Render from "./master-format/render";
import PageBuilderInterface from "./page-builder.d";
import buildStage from "./stage-builder";
import StageUpdateAfterParamsInterface from "./stage-update-after-params";
import deferred from "./utils/promise-deferred";
import DeferredInterface from "./utils/promise-deferred.d";

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
    public focusChild: KnockoutObservable<boolean> = ko.observable(false);
    public stageLoadingMessage: string = $t("Please hold! we're just retrieving your content...");
    public dataStore: DataStore = new DataStore();
    public afterRenderDeferred: DeferredInterface = deferred();
    private template: string = "Magento_PageBuilder/content-type/preview";
    private render: Render = new Render();
    private collection: Collection = new Collection();

    /**
     * Debounce the applyBindings call by 500ms to stop duplicate calls
     *
     * @type {(() => void) & _.Cancelable}
     */
    private applyBindingsDebounce = _.debounce(() => {
        this.render.applyBindings(this.children)
            .then((renderedOutput) => events.trigger(`stage:${ this.id }:masterFormatRenderAfter`, {
                value: renderedOutput,
            }));
    }, 500);

    /**
     * @param {PageBuilderInterface} parent
     */
    constructor(parent: PageBuilderInterface) {
        this.parent = parent;
        this.id = parent.id;
        generateAllowedParents();

        // Wait for the stage to be built alongside the stage being rendered
        Promise.all([
            buildStage(this, this.parent.initialValue),
            this.afterRenderDeferred.promise,
        ]).then(this.ready.bind(this));
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
        events.trigger(`stage:${ this.id }:readyAfter`, {stage: this});
        this.loading(false);
        this.initListeners();

        // Ensure we complete an initial save of the data within the stage once we're ready
        events.trigger("stage:updateAfter", {stageId: this.id});
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
            () => events.trigger("stage:updateAfter", {stageId: this.id}),
        );

        // ContentType being removed from container
        events.on("contentType:removeAfter", (args: ContentTypeRemovedParamsInterface) => {
            if (args.stageId === this.id) {
                this.onContentTypeRemoved(args);
            }
        });

        // Any store state changes trigger a stage update event
        this.dataStore.subscribe(() => events.trigger("stage:updateAfter", {stageId: this.id}));

        // Watch for stage update events & manipulations to the store, debounce for 50ms as multiple stage changes
        // can occur concurrently.
        events.on("stage:updateAfter", (args: StageUpdateAfterParamsInterface) => {
            if (args.stageId === this.id) {
                this.applyBindingsDebounce();
            }
        });

        let interactionLevel = 0;

        events.on("stage:interactionStart", () => {
            ++interactionLevel;
            this.interacting(true);
        });
        events.on("stage:interactionStop", (args: {force: boolean}) => {
            const forced = (_.isObject(args) && args.force === true);
            if (--interactionLevel === 0 || forced) {
                this.interacting(false);
                if (forced) {
                    interactionLevel = 0;
                }
            }
        });
        events.on("stage:childFocusStart", () => this.focusChild(true));
        events.on("stage:childFocusStop", () => this.focusChild(false));
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
