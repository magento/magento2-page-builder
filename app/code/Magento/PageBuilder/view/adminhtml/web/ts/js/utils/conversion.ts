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

/**
 * Convert HEX value to RGB or RGBA
 *
 * @param hexValue
 * @param alphaValue optional
 * @returns {string}
 */

export function colorConverter(hexValue: string, alphaValue: string) {
    const colors = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
    const red = parseInt(colors[1], 16);
    const green = parseInt(colors[2], 16);
    const blue = parseInt(colors[3], 16);
    if (alphaValue) {
        return "rgba(" + red + "," + green + "," + blue + "," + alphaValue + ")";
    } else {
        return "rgba(" + red + "," + green + "," + blue + ")";
    }
}
