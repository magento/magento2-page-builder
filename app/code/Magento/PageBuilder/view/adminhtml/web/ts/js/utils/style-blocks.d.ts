/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
export interface StyleBlocks {
    [key: string]: StyleBlock;
}

/**
 * @api
 */
export interface StyleBlock {
    [key: string]: string | number;
}
