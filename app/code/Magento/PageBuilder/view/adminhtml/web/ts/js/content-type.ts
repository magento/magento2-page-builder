/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import mageUtils from "mageUtils";
import _ from "underscore";
import Config from "./config";
import ContentTypeCollectionInterface from "./content-type-collection.types";
import ContentTypeConfigInterface from "./content-type-config.types";
import ContentTypeInterface from "./content-type.types";
import Master from "./content-type/master";
import Preview from "./content-type/preview";
import DataStore, {DataObject} from "./data-store";

export default class ContentType<P extends Preview = Preview, M extends Master = Master>
    implements ContentTypeInterface<P, M>
{
    public id: string = mageUtils.uniqueid();
    public parentContentType: ContentTypeCollectionInterface;
    public stageId: string;
    public config: ContentTypeConfigInterface;
    public element: JQuery;
    public dataStore: DataStore = new DataStore();
    public dataStores: {[key: string]: DataStore} = {};
    public preview: P;
    public content: M;
    public dropped: boolean = false;

    /**
     * @param {ContentTypeInterface} parentContentType
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    constructor(
        parentContentType: ContentTypeCollectionInterface,
        config: ContentTypeConfigInterface,
        stageId: string,
    ) {
        this.parentContentType = parentContentType;
        this.config = config;
        this.stageId = stageId;
        this.initDataStores();
        this.bindEvents();
    }

    /**
     * Destroys current instance
     */
    public destroy(): void {
        const params = {
            contentType: this,
            index: this.parentContentType ?
                (this.parentContentType as ContentTypeCollectionInterface).getChildren().indexOf(this) :
                null,
            parentContentType: this.parentContentType,
            stageId: this.stageId,
        };
        this.preview ? this.preview.destroy() : this.content.destroy();
        events.trigger("contentType:removeAfter", params);
        events.trigger(this.config.name + ":removeAfter", params);
    }

    protected bindEvents() {
        const eventName: string = this.config.name + ":" + this.id + ":updateAfter";
        const paramObj: any = {};
        paramObj[this.id] = this;
        this.dataStore.subscribe(
            (state: DataObject) => {
                if (!_.isEmpty(this.dataStores)) {
                    const viewport = Config.getConfig("viewport") || Config.getConfig("defaultViewport");
                    this.dataStores[viewport].setState(state);
                }
                return events.trigger(
                    eventName,
                    paramObj,
                );
            },
        );

        this.dataStore.subscribe(
            () => events.trigger(
                "stage:updateAfter",
                {stageId: this.stageId},
            ),
        );
        events.on(`stage:${this.stageId}:viewportChangeAfter`, this.onViewportSwitch.bind(this));
    }

    /**
     * Change data stores on viewport change.
     * @param {Object} args
     */
    private onViewportSwitch(args: {viewport: string, previousViewport: string}) {
        if (this.dataStores[args.viewport]) {
            const currentViewportState = this.dataStores[args.viewport].getState();
            const previousViewportState = this.dataStore.getState();
            const viewportFields = this.getViewportFields(args.viewport, currentViewportState);
            const previousViewportFields = this.getViewportFields(args.previousViewport, previousViewportState);

            // Filter viewport specific data for states
            this.dataStore.setState(_.extend(
                currentViewportState,
                _.omit(previousViewportState, previousViewportFields),
                _.pick(currentViewportState, viewportFields),
            ));
        }
    }

    /**
     * Get viewport fields keys.
     *
     * @param {string} viewport
     * @param {DataObject} data
     */
    private getViewportFields(viewport: string, data: DataObject): string[] {
        const viewportConfig = this.config.breakpoints[viewport];

        if (!viewportConfig) {
            return [];
        }
        const appearance = data.appearance + "-appearance";
        const fields = viewportConfig.fields[appearance] || viewportConfig.fields.default;

        return _.keys(fields);
    }

    /**
     * Init data store for each viewport.
     */
    private initDataStores() {
        if (!_.isEmpty(this.config.breakpoints)) {
            _.each(this.config.breakpoints, (value, name: string) => {
                this.dataStores[name] = new DataStore();
            });
            this.dataStores[Config.getConfig("defaultViewport")] = new DataStore();
        }
    }
}
