/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Check for whether url string contains only a path
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isPathOnly(url: string): boolean {
    return url.indexOf("/") === 0;
}

/**
 * Get the path from a URL
 *
 * @param {string} url
 * @returns {string}
 */
export function getPathFromUrl(url: string): string {
    const a = document.createElement("a");

    a.href = url;

    return a.pathname;
}
