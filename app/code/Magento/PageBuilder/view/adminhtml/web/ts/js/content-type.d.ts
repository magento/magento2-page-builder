/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface ContentTypeInterface {
    id: string;
    stageId: string;
    parent: ContentTypeInterface;
    config: {},
    data: {},
    preview: {}
}