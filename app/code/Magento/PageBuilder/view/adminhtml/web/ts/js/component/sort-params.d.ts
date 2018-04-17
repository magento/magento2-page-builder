/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeInterface from "../content-type.d"

export interface SortParamsInterface {
    block: ContentTypeInterface;
    event: Event;
    originalEle: JQuery;
    placeholder: JQuery;
    helper?: any;
}
