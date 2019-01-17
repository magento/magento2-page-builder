/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeInterface from "./content-type.types";
import MasterCollection from "./content-type/master-collection";
import PreviewCollection from "./content-type/preview-collection";

export default interface ContentTypeCollectionInterface<P extends PreviewCollection = PreviewCollection,
    M extends MasterCollection = MasterCollection> extends ContentTypeInterface<P, M>
{
    readonly children: KnockoutObservableArray<ContentTypeCollectionInterface | ContentTypeInterface>;

    /**
     * Add a child into the observable array
     *
     * @param {ContentTypeInterface} child
     * @param {number} index
     */
    addChild(child: ContentTypeInterface, index?: number): void;

    /**
     * Set the children observable array into the class
     *
     * @param {KnockoutObservableArray<ContentTypeInterface>} children
     */
    setChildren(children: KnockoutObservableArray<ContentTypeInterface>): void;

    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface>}
     */
    getChildren(): KnockoutObservableArray<ContentTypeInterface | ContentTypeCollectionInterface>;

    /**
     * Remove a child from the observable array
     *
     * @param child
     */
    removeChild(child: ContentTypeInterface): void;
}
