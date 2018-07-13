/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ValueInterface from "./value.d";

/**
 * @api
 */
export interface OptionInterface {
    key: string;
    type: string;
    values: ValueInterface[];
}
