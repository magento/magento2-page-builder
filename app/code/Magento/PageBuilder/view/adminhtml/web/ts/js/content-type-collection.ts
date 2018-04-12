/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ConfigContentBlock} from "./component/config";
import EventBus from "./component/event-bus";
import ContentTypeCollectionInterface from "./content-type-collection.d";
import ContentType from "./content-type";
import ContentTypeInterface from "./content-type.d";
import Collection from "./collection";

export default class ContentTypeCollection extends ContentType implements ContentTypeCollectionInterface {
    private collection: Collection = new Collection();

    constructor(
        parent: ContentTypeInterface,
        config: ConfigContentBlock,
        stageId,
        formData,
        previewBuilder,
        contentBuilder,
    ) {
        super(parent, config, stageId, formData, previewBuilder, contentBuilder);
        this.bindEvents();
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

        // Trigger a mount event when a child is added into a parent, meaning it'll be re-rendered
        _.defer(() => {
            EventBus.trigger("block:mount", {id: child.id, block: child});
            EventBus.trigger(child.config.name + ":block:mount", {id: child.id, block: child});
        });
    }

    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    public removeChild(child: any): void {
        this.collection.removeChild(child);
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

    private bindEvents() {
        this.collection.getChildren().subscribe(
            () => EventBus.trigger("stage:updated", {stageId: this.stageId})
        );
    }
}
