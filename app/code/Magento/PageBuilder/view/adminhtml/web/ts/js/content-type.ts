/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import mageUtils from "mageUtils";
import DataStore from "./component/data-store";
import EventBus from "./component/event-bus";
import Content from "./content";
import ContentTypeConfigInterface from "./content-type-config.d";
import ContentTypeInterface from "./content-type.d";
import Preview from "./preview";

export default class ContentType implements ContentTypeInterface {
    public id: string = mageUtils.uniqueid();
    public parent: ContentTypeInterface;
    public stageId: string;
    public config: ContentTypeConfigInterface;
    public data = {};
    public wrapperStyle: KnockoutObservable<object> = ko.observable({width: "100%"});
    public element: JQuery<HTMLElement>;
    public store: DataStore = new DataStore();
    public preview: Preview;
    public content: Content;

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        stageId: string,
    ) {
        this.parent = parent;
        this.config = config;
        this.stageId = stageId;
        this.bindEvents();
    }

    protected bindEvents() {
        const eventName: string = this.id + ":updated";
        const paramObj: any = {};
        paramObj[this.id] = this;
        this.store.subscribe(
            () => EventBus.trigger(
                eventName,
                paramObj,
            ),
        );

        this.store.subscribe(
            () => EventBus.trigger(
                "stage:updated",
                {stageId: this.stageId},
            ),
        );
    }
}
