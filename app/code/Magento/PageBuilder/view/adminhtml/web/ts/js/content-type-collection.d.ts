/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeInterface from "./content-type.d";
import Master from "./content-type/master";
import Preview from "./content-type/preview";

export default interface ContentTypeCollectionInterface<P = Preview, M = Master> extends ContentTypeInterface<P, M> {
    children: KnockoutObservableArray<any>;

    addChild(child: ContentTypeInterface, index?: number): void;

    setChildren(children: KnockoutObservableArray<ContentTypeInterface>): void;

    getChildren(): KnockoutObservableArray<ContentTypeInterface>;

    removeChild(child: any): void;
}
