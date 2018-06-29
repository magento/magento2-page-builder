/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "./content-type-collection.d";
import ContentTypeInterface from "./content-type.d";

/**
 * @api
 */
export default interface ContentTypeRemovedParamsInterface {
    parent: ContentTypeCollectionInterface;
    index: number;
    contentType: ContentTypeInterface;
    stageId: string;
}
