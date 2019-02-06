/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";

/**
 * Validate if content has page builder format
 *
 * @param {string} content
 * @returns {boolean}
 */
export default function Validate(content: string) {
    const stageDocument = document.createElement("div");

    stageDocument.setAttribute(Config.getConfig("dataContentTypeAttributeName"), "stage");
    stageDocument.innerHTML = content;
    return !!stageDocument.querySelector(
        "[" + Config.getConfig("dataContentTypeAttributeName") + "=\"row\"]",
    );
}
