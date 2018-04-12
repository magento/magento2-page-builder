/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import alertDialog from "Magento_Ui/js/modal/alert";
import _ from "underscore";
import DataStore from "./data-store";
import EventBus from "./event-bus";
import buildStage from "./stage-builder";
import {handleEvents} from "./stage/event-handling-delegate";
import Save from "./stage/save";
import Collection from "../collection";

export default class Stage {
    public config: {} = {
        name: "stage",
    };
    public loading: KnockoutObservable<boolean>;
    public parent: any;
    public showBorders: KnockoutObservable<boolean> = ko.observable(false);
    public interacting: KnockoutObservable<boolean> = ko.observable(false);
    public userSelect: KnockoutObservable<boolean> = ko.observable(true);
    public stageLoadingMessage: string = $t("Please hold! we're just retrieving your content...");
    public stage: Stage;
    public store: DataStore;
    private template: string = "Magento_PageBuilder/component/stage.html";
    private save: Save = new Save();
    private saveRenderTree = _.debounce(() => {
        this.save.renderTree(this.children)
            .then((renderedOutput) => EventBus.trigger(`stage:renderTree:${ this.id }`, {
                value: renderedOutput,
            }));
    }, 500);
    private collection: Collection;

    /**
     * Constructor
     *
     * @param parent
     */
    constructor(parent: any) {
        this.collection = new Collection();
        this.collection.getChildren().subscribe(
            () => EventBus.trigger("stage:updated", {stageId: this.stageId})
        );
        this.parent = parent;
        this.id = parent.id;
        this.loading = parent.loading;
        this.stage = this;

        // Create our state and store objects
        this.store = new DataStore();

        // Handle events for this stage instance
        handleEvents(this);
        this.initListeners();

        buildStage(this, parent.initialValue).then(this.ready.bind(this));
    }

    /**
     * Init listeners.
     */
    public initListeners() {
        // Any store state changes trigger a stage update event
        this.store.subscribe(() => EventBus.trigger("stage:updated", {stageId: this.id}));

        // Watch for stage update events & manipulations to the store, debounce for 50ms as multiple stage changes
        // can occur concurrently.
        EventBus.on("stage:updated", (event, params) => {
            if (params.stageId === this.id) {
                this.saveRenderTree.call(this);
            }
        });
        EventBus.on("interaction:start", () => this.interacting(true));
        EventBus.on("interaction:stop", () => this.interacting(false));
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
        EventBus.trigger(`stage:ready:${ this.id }`, { stage: this });
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
}
