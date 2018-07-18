/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";

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
    const regexp = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?.*?}}/;
    if (regexp.test(value)) {
        const [, url, type] = regexp.exec(value);
        const image = {
            name: url.split("/").pop(),
            size: 0,
            type: "image/" + type,
            url: Config.getConfig("media_url") + url,
            id: "",
        };
        const imageIdMatch = value.match(/{{.*\s*id\s*="?([a-zA-Z0-9-]*)"?\s*}}/);

        if (imageIdMatch) {
            image.id = imageIdMatch[1];
        }

        result = [image];
    }
    return result;
}
