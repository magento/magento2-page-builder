/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeInterface from "./content-type.d";
import MasterCollection from "./content-type/master-collection";
import PreviewCollection from "./content-type/preview-collection";

export default interface ContentTypeCollectionInterface<P = PreviewCollection, M = MasterCollection>
    extends ContentTypeInterface<P, M>
{
    children: KnockoutObservableArray<ContentTypeCollectionInterface | ContentTypeInterface>;

    addChild(child: ContentTypeInterface, index?: number): void;

    setChildren(children: KnockoutObservableArray<ContentTypeInterface>): void;

    getChildren(): KnockoutObservableArray<ContentTypeInterface>;

    removeChild(child: any): void;
}
