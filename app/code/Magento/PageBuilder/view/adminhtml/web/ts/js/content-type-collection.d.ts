/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Collection from "./collection";
import ContentTypeInterface from "./content-type.d";

export default interface ContentTypeCollectionInterface extends ContentTypeInterface {
    children: KnockoutObservableArray<any>;
    collection: Collection;

    addChild(child: ContentTypeInterface, index?: number): void;

    setChildren(children: KnockoutObservableArray<ContentTypeInterface>): void;

    getChildren(): KnockoutObservableArray<ContentTypeInterface>;

    removeChild(child: any): void;
}
