/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "./content-type-collection.types";
import ContentTypeInterface from "./content-type.types";

/**
 * @api
 */
export default interface ContentTypeRemovedParamsInterface {
    parent: ContentTypeCollectionInterface;
    index: number;
    contentType: ContentTypeInterface;
    stageId: string;
}
