/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ToolbarOptionsValueInterface from "./toolbar-options-value.d";

export interface ToolbarOptionsInterface {
    key: string;
    type: string;
    options: ToolbarOptionsValueInterface[];
}
