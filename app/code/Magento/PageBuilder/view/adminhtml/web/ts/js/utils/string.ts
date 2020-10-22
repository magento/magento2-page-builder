/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Convert from snake case to camel case
 *
 * @param {string} currentString
 * @returns {string}
 * @api
 */
export function fromSnakeToCamelCase(currentString: string): string {
    const parts: string[] = currentString.split(/[_-]/);
    let newString: string = "";
    for (let i = 1; i < parts.length; i++) {
        newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
    }
    return parts[0] + newString;
}

/**
 * Convert a camel case string to snake case
 *
 * @param currentString
 */
export function fromCamelCaseToDash(currentString: string): string {
    return currentString.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
