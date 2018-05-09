/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeInterface from "./content-type.d";

export default interface ContentTypeRemovedParamsInterface {
    parent: ContentTypeInterface;
    index: number;
    block: ContentTypeInterface;
    stageId: string;
}
