/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import mageUtils from "mageUtils";
import ContentTypeCollectionInterface from "./content-type-collection.d";
import ContentTypeConfigInterface from "./content-type-config.d";
import ContentTypeInterface from "./content-type.d";
import Master from "./content-type/master";
import Preview from "./content-type/preview";
import DataStore from "./data-store";

export default class ContentType<P extends Preview = Preview, M extends Master = Master>
    implements ContentTypeInterface<P, M>
{
    public id: string = mageUtils.uniqueid();
    public parent: ContentTypeCollectionInterface;
    public stageId: string;
    public config: ContentTypeConfigInterface;
    public element: JQuery;
    public dataStore: DataStore = new DataStore();
    public preview: P;
    public content: M;
    public dropped: boolean = false;

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    constructor(
        parent: ContentTypeCollectionInterface,
        config: ContentTypeConfigInterface,
        stageId: string,
    ) {
        this.parent = parent;
        this.config = config;
        this.stageId = stageId;
        this.bindEvents();
    }

    protected bindEvents() {
        const eventName: string = this.config.name + ":" + this.id + ":updateAfter";
        const paramObj: any = {};
        paramObj[this.id] = this;
        this.dataStore.subscribe(
            () => events.trigger(
                eventName,
                paramObj,
            ),
        );

        this.dataStore.subscribe(
            () => events.trigger(
                "stage:updateAfter",
                {stageId: this.stageId},
            ),
        );
    }
}
