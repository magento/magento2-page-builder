/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface StyleBlocks {
    [key: string]: StyleBlock;
}

export interface StyleBlock {
    [key: string]: string | number;
}
