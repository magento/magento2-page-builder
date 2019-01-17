/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeInterface from "../content-type";
import ContentTypeCollectionInterface from "../content-type-collection";

/**
 * Content type event fired whenever content changes dimensions or visibility
 *
 * @api
 */
export default interface ContentTypeRedrawAfterEventParamsInterface {
    id: string;
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
}
