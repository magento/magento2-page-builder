/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import mageUtils from "mageUtils";
import PreviewBlock from "./component/block/preview/block";
import {ConfigContentBlock} from "./component/config";
import DataStore from "./component/data-store";
import EventBus from "./component/event-bus";
import ContentTypeInterface from "./content-type.d";

export default class ContentType implements ContentTypeInterface {
    public id: string = mageUtils.uniqueid();
    public stageId: string;
    public config: ConfigContentBlock;
    public data = {};
    public wrapperStyle: KnockoutObservable<object> = ko.observable({width: "100%"});
    public element: JQuery<HTMLElement>;
    public store: DataStore = new DataStore();
    public preview: PreviewBlock;
    private previewBuilder;
    private content;
    private contentBuilder;

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param config
     * @param contentBuilder
     */
    constructor(
        parent: ContentTypeInterface,
        config: ConfigContentBlock,
        stageId,
        formData,
        previewBuilder,
        contentBuilder,
    ) {
        this.stageId = stageId;
        this.parent = parent;
        this.config = config;
        this.previewBuilder = previewBuilder;
        this.contentBuilder = contentBuilder;

        this.preview = this.previewBuilder.setContentType(this)
            .build();
        this.content = this.contentBuilder.setContentType(this)
            .build();

        const eventName: string = this.id + ":updated";
        const paramObj: any = {};
        paramObj[this.id] = this;

        this.store.subscribe(() => EventBus.trigger(eventName, paramObj));

        this.store.subscribe(
            () => EventBus.trigger("stage:updated", {stageId: this.stageId})
        );

        this.store.update(
            this.id,
            formData,
        );
    }
}
