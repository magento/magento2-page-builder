/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
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
