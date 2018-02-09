/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../component/config";

/**
 * Decode image background URL to object
 *
 * @param value
 * @returns {Object}
 */
export function decodeUrl(value: string): string | [object] {
    let result: any = "";
    value = decodeURIComponent((value).replace(window.location.href, ""));
    const regexp = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/;
    if (regexp.test(value)) {
        const [, url, type] = regexp.exec(value);
        const image = {
            name: url.split("/").pop(),
            size: 0,
            type: "image/" + type,
            url: Config.getInitConfig("media_url") + url,
        };
        result = [image];
    }
    return result;
}
