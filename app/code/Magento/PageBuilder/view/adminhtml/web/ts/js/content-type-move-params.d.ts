/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import ContentTypeInterface from "./content-type";
import ContentTypeCollectionInterface from "./content-type-collection.d";

/**
 * @api
 */
export interface ContentTypeMoveParamsInterface {
    contentType: ContentTypeInterface;
    sourceParent: ContentTypeCollectionInterface;
    targetParent: ContentTypeCollectionInterface;
    targetIndex: number;
    stageId: string;
}
