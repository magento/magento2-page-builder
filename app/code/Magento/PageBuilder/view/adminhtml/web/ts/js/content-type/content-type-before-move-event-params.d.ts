/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../content-type-collection.types";
import ContentTypeInterface from "../content-type.types";

/**
 * @api
 */
export interface ContentTypeBeforeMoveEventParams {
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
    sourceParent: ContentTypeCollectionInterface;
    targetParent: ContentTypeCollectionInterface;
    targetIndex: number;
    stageId: string;
}
