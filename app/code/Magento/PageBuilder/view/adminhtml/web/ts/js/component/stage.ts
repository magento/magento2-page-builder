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
import {StageInterface} from "./stage.d";
import {handleEvents} from "./stage/event-handling-delegate";
import Save from "./stage/save";
import EditableArea from "./stage/structural/editable-area";

export default class Stage extends EditableArea implements StageInterface {
    public template: string = "Magento_PageBuilder/component/stage.html";
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
    private save: Save = new Save();
    private saveRenderTree = _.debounce(() => {
        this.save.renderTree(this.children)
            .then((renderedOutput) => EventBus.trigger(`stage:renderTree:${ this.id }`, {
                value: renderedOutput,
            }));
    }, 500);

    /**
     * Constructor
     *
     * @param parent
     */
    constructor(parent: any) {
        super();
        this.parent = parent;
        this.id = parent.stageId;
        this.loading = parent.loading;
        this.stage = this;
        this.setChildren();

        // Create our state and store objects
        this.store = new DataStore();

        // Handle events for this stage instance
        handleEvents(this);
        this.initListeners();

        buildStage(this, parent.initialValue).then(this.ready.bind(this));
    }

    public initListeners() {
        // Any store state changes trigger a stage update event
        this.store.subscribe(() => EventBus.trigger("stage:updated", {stage: this}));

        // Watch for stage update events & manipulations to the store, debounce for 50ms as multiple stage changes
        // can occur concurrently.
        EventBus.on("stage:updated", (event, params) => {
            if (params.stage.id === this.id) {
                this.saveRenderTree.call(this);
            }
        });
        EventBus.on("interaction:start", () => this.interacting(true));
        EventBus.on("interaction:stop", () => this.interacting(false));
    }

    public getTemplate() {
        return this.template;
    }

    /**
     * The stage has been initiated fully and is ready
     */
    public ready() {
        EventBus.trigger(`stage:ready:${ this.id }`, { stage: this });
        this.children.valueHasMutated();
        this.loading(false);
    }

    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    public removeChild(child: any): void {
        if (this.children().length === 1) {
            alertDialog( {
                content: $t("You are not able to remove the final row from the content."),
                title: $t("Unable to Remove"),
            });
            return;
        }
        super.removeChild(child);
    }
}
