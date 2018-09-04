/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../content-type-collection";
import ContentTypeInterface from "../content-type";

/**
 * Content type event fired whenever content changes dimensions or visibility
 *
 * @api
 */
export default interface ContentTypeRedrawAfterEventParamsInterface {
    id: string,
    contentType: ContentTypeInterface & ContentTypeCollectionInterface
}