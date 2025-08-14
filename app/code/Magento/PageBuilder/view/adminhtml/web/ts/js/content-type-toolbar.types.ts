/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
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
