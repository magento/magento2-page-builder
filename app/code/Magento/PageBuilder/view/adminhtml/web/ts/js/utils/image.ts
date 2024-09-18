/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";
import {toDataUrl} from "./directives";
import {convertUrlToPathIfOtherUrlIsOnlyAPath} from "./url";

/**
 * Decode image background URL to object
 *
 * @param value
 * @returns {Object}
 * @api
 */
export function decodeUrl(value: string): string | [object] {
    let result: any = "";
    value = decodeURIComponent((value).replace(window.location.href, ""));
    const regexp = /{{.*\s*url="?(.*\.([a-z|A-Z|0-9?=]*))\"?\s*}}/;
    if (regexp.test(value)) {
        const [, url, type] = regexp.exec(value);
        const image = {
            name: url.split("/").pop(),
            size: 0,
            type: "image/" + type,
            url: Config.getConfig("media_url") + url,
        };
        result = [image];
    }
    return result;
}

/**
 * Convert a URL to an image directive
 *
 * @param {string} imageUrl
 * @returns {string}
 */
export function urlToDirective(imageUrl: string) {
    const mediaUrl = convertUrlToPathIfOtherUrlIsOnlyAPath(Config.getConfig("media_url"), imageUrl);

    const mediaPath = imageUrl.split(mediaUrl);
    return "{{media url=" + mediaPath[1] + "}}";
}

/**
 * Convert an image URL to a background image data uri
 *
 * @param {string} imageUrl
 * @returns {string}
 */
export function imageToBackgroundImageDataUrl(imageUrl: string) {
    return "url(\'" + toDataUrl(urlToDirective(imageUrl)) + "\')";
}
