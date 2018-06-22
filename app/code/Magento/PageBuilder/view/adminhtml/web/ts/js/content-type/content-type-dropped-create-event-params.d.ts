/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../content-type-collection.d";
import ContentTypeInterface from "../content-type.d";

export default interface ContentTypeDroppedCreateEventParamsInterface {
    id: string;
    contentType: ContentTypeInterface & ContentTypeCollectionInterface;
}
