/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeConfigInterface from "./content-type-config.d";
import ContentTypeInterface from "./content-type.d";

export default interface ContentTypeDroppedParamsInterface {
    parent: ContentTypeInterface;
    index: number;
    contentType: {
        config: ContentTypeConfigInterface,
    };
    stageId: string;
}
