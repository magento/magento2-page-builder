/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Check for whether url string contains only a path
 *
 * @param {String} url
 * @returns {Boolean}
 */
function isPathOnly(url: string): boolean {
    return url.indexOf("/") === 0;
}

/**
 * Get the path from a URL
 *
 * @param {String} url
 * @returns {String}
 */
function getPathFromUrl(url: string): string {
    const a = document.createElement("a");

    a.href = url;

    return a.pathname;
}

/**
 * Convert url to path if other url is only a path
 *
 * @param {string} url
 * @param {string} otherUrl
 * @returns {string}
 * @api
 */
export function convertUrlToPathIfOtherUrlIsOnlyAPath(url: string, otherUrl: string): string {
    return isPathOnly(otherUrl) ? getPathFromUrl(url) : url;
}
