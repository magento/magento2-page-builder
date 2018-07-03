/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * @api
 */
export interface ConfigFieldInterface {
    [key: string]: {
        default: null | string | number;
    };
}
