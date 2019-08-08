/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";

/**
 * Validate if content has page builder format by checking for any data-content-type attributes
 *
 * @param {string} content
 * @returns {boolean}
 */
export default function validate(content: string) {
    const stageDocument = new DOMParser().parseFromString(content, "text/html");
    return !!stageDocument.querySelector(
        `[${Config.getConfig("dataContentTypeAttributeName")}]`,
    );
}
