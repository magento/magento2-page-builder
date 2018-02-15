/*eslint-disable */
define([], function () {
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
    function isPathOnly (url) {
        return url.indexOf("/") === 0;
    }

    /**
     * Get the path from a URL
     *
     * @param {String} url
     * @returns {String}
     */
    function getPathFromUrl (url) {
        const a = document.createElement("a");

        a.href = url;

        return a.pathname;
    }

    /**
     * Convert url to path if other url is only a path
     *
     * @param {String} url
     * @param {String} otherUrl
     * @returns {String}
     */
    function convertUrlToPathIfOtherUrlIsOnlyAPath (url, otherUrl) {
        return isPathOnly(otherUrl) ? getPathFromUrl(url) : url;
    }

    return {
        getPathFromUrl: getPathFromUrl,
        isPathOnly: isPathOnly,
        convertUrlToPathIfOtherUrlIsOnlyAPath: convertUrlToPathIfOtherUrlIsOnlyAPath
    };
});
//# sourceMappingURL=url.js.map
