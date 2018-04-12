/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "./component/config";

export interface ContentTypeInterface {
    id: string;
    stageId: string;
    parent: ContentTypeInterface;
    config: Config,
    data: {},
    preview: {}
}
