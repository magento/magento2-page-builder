/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Convert percent to decimal
 *
 * @param {string} value
 * @returns {string}
 */
export function convertPercentToDecimal(value: string) {
    return (parseInt(value, 10) / 100).toString();
}
