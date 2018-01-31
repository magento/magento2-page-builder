/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../component/config";

interface ImageObject {
    name: string;
    size: number;
    type: string;
    url: string;
}

/**
 * Decode image background URL to object
 *
 * @param value
 * @returns {Object}
 */
export function decodeUrl(value: any): string | ImageObject[] {
    let result: any = "";
    value = decodeURIComponent((value as string).replace(window.location.href, ""));
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
