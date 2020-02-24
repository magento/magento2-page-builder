/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import "Magento_PageBuilder/js/resource/jquery/ui/jquery.ui.touch-punch";
import mageUtils from "mageUtils";
import _ from "underscore";
import "./binding/sortable";
import Collection from "./collection";
import ContentTypeCollectionInterface from "./content-type-collection.types";
import {ContentTypeRemovedParamsInterface} from "./content-type/content-type-events.types";
import DataStore from "./data-store";
import {generateAllowedParents} from "./drag-drop/matrix";
import Render from "./master-format/render";
import PageBuilderInterface from "./page-builder.types";
import buildStage from "./stage-builder";
import {StageUpdateAfterParamsInterface} from "./stage-events.types";
import deferred, {DeferredInterface} from "./utils/promise-deferred";

export default class Stage {
    public static readonly rootContainerName: string = "root-container";
    public pageBuilder: PageBuilderInterface;
    public id: string;
    public loading: KnockoutObservable<boolean> = ko.observable(true);
    public showBorders: KnockoutObservable<boolean> = ko.observable(false);
    public interacting: KnockoutObservable<boolean> = ko.observable(false);
    public userSelect: KnockoutObservable<boolean> = ko.observable(true);
    public focusChild: KnockoutObservable<boolean> = ko.observable(false);
    public dataStore: DataStore = new DataStore();
    public afterRenderDeferred: DeferredInterface = deferred();
    public rootContainer: ContentTypeCollectionInterface;
    /**
     * We always complete a single render when the stage is first loaded, so we can set the lock when the stage is
     * created. The lock is used to halt the parent forms submission when Page Builder is rendering.
     */
    public renderingLocks: Array<JQueryDeferred<string>> = [];
    private template: string = "Magento_PageBuilder/content-type/preview";
    private render: Render;
    private collection: Collection = new Collection();
    private lastRenderId: string;

    /**
     * Debounce the applyBindings call by 500ms to stop duplicate calls
     *
     * @type {(() => void) & _.Cancelable}
     */
    private applyBindingsDebounce = _.debounce((renderId: string) => {
        this.render.applyBindings(this.rootContainer)
            .then((renderedOutput: string) => {
                if (this.lastRenderId === renderId) {
                    events.trigger(`stage:${ this.id }:masterFormatRenderAfter`, {
                        value: renderedOutput,
                    });
                    this.renderingLocks.forEach((lock) => {
                        lock.resolve(renderedOutput);
                    });
                }
            }).catch((error: Error) => {
                if (error) {
                    console.error(error);
                }
            });
    }, 500);

    /**
     * @param {PageBuilderInterface} pageBuilder
     * @param {ContentTypeCollectionInterface} rootContainer
     */
    constructor(pageBuilder: PageBuilderInterface, rootContainer: ContentTypeCollectionInterface) {
        this.pageBuilder = pageBuilder;
        this.id = pageBuilder.id;
        this.render = new Render(pageBuilder.id);
        this.rootContainer = rootContainer;
        generateAllowedParents();

        // Fire an event after the DOM has rendered
        this.afterRenderDeferred.promise.then(() => {
            this.render.setupChannel();
            events.trigger(`stage:${ this.id }:renderAfter`, {stage: this});
        });

        // Wait for the stage to be built alongside the stage being rendered
        Promise.all([
            buildStage(this, this.pageBuilder.initialValue),
            this.afterRenderDeferred.promise,
        ]).then(this.ready.bind(this)).catch((error) => {
            console.error(error);
        });
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
                // Create the rendering lock straight away
                this.createLock();
                const renderId = mageUtils.uniqueid();
                this.lastRenderId = renderId;
                this.applyBindingsDebounce(renderId);
            }
        });

        let interactionLevel = 0;

        events.on("stage:interactionStart", () => {
            ++interactionLevel;
            this.interacting(true);
        });
        events.on("stage:interactionStop", (args: {force: boolean}) => {
            const forced = (_.isObject(args) && args.force === true);
            interactionLevel = Math.max(interactionLevel - 1, 0);

            if (interactionLevel === 0 || forced) {
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
     * Create a new lock for rendering
     */
    private createLock(): void {
        this.renderingLocks.push($.Deferred());
    }

    /**
     * On content type removed
     *
     * @param params
     */
    private onContentTypeRemoved(params: ContentTypeRemovedParamsInterface): void {
        if (params.parentContentType) {
            params.parentContentType.removeChild(params.contentType);
        }
    }
}
