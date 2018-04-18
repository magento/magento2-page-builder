/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Collection from "./collection";
import EventBus from "./component/event-bus";
import ContentType from "./content-type";
import ContentTypeCollectionInterface from "./content-type-collection.d";
import ContentTypeInterface from "./content-type.d";

export default class ContentTypeCollection extends ContentType implements ContentTypeCollectionInterface {
    private collection: Collection = new Collection();

    /**
     * @param parent
     * @param config
     * @param stageId
     */
    constructor(
        parent: ContentTypeInterface,
        config: ConfigContentBlock,
        stageId: string,
    ) {
        super(parent, config, stageId);
        this.bindEvents();
        this.collection.getChildren().subscribe(
            () => EventBus.trigger("stage:updated", {stageId: this.stageId}),
        );
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
     * Return the preview of children of the current element
     *
     * @returns {KnockoutObservableArray<Preview>}
     */
    public getChildrenPreview(): any[] {
        const previewArray: any[] = [];
        this.collection.children().forEach((preview: any) => {
            previewArray.push(preview.preview);
        });
        return previewArray;
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
}
