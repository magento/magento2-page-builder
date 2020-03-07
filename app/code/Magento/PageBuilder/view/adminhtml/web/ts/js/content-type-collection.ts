/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import Collection from "./collection";
import ContentType from "./content-type";
import ContentTypeCollectionInterface from "./content-type-collection.types";
import ContentTypeConfigInterface from "./content-type-config.types";
import ContentTypeInterface from "./content-type.types";
import MasterCollection from "./content-type/master-collection";
import PreviewCollection from "./content-type/preview-collection";

export default class ContentTypeCollection<P extends PreviewCollection = PreviewCollection,
    M extends MasterCollection = MasterCollection> extends ContentType<P, M>
    implements ContentTypeCollectionInterface<P, M>
{
    private collection: Collection = new Collection();

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
        super(parentContentType, config, stageId);
        this.collection.getChildren()
            .subscribe(
                () => events.trigger("stage:updateAfter", {stageId: this.stageId}),
            );
    }

    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface>}
     */
    public getChildren(): KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface> {
        return this.collection.getChildren();
    }

    /**
     * Add a child into the observable array
     *
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} child
     * @param {number} index
     */
    public addChild(child: ContentTypeInterface, index?: number): void {
        child.parentContentType = this;
        this.collection.addChild(child, index);

        // Trigger a mount event when a child is added into a container content type, meaning it'll be re-rendered
        _.defer(() => {
            events.trigger("contentType:mountAfter", {id: child.id, contentType: child});
            events.trigger(child.config.name + ":mountAfter", {id: child.id, contentType: child});
        });
    }

    /**
     * Remove a child from the observable array
     *
     * @param {ContentTypeInterface} child
     */
    public removeChild(child: ContentTypeInterface): void {
        this.collection.removeChild(child);
    }

    /**
     * Destroys current instance and all children
     */
    public destroy(): void {
        [...this.getChildren()()].forEach((contentType: ContentTypeInterface) => {
            contentType.destroy();
        });
        super.destroy();
    }

    /**
     * Set the children observable array into the class
     *
     * @param {KnockoutObservableArray<ContentTypeInterface>} children
     */
    public setChildren(children: KnockoutObservableArray<ContentTypeInterface>) {
        this.collection.setChildren(children);
    }

    get children(): KnockoutObservableArray<ContentTypeInterface> {
        return this.collection.getChildren();
    }
}
