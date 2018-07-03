/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
export default interface OptionInterface {
    code: string;
    icon?: string;
    title?: string;
    classes?: string;
    sort: number;
    optionTemplate?: string;
}
