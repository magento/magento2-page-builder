/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
export interface OptionInterface {
    key: string;
    type: string;
    values: ValueInterface[];
}

/**
 * @api
 */
export interface ValueInterface {
    value: string;
    label: string;
    icon: string;
}
