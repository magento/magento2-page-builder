/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Determine if the current browser supports position sticky
 *
 * @returns {boolean}
 */
export function supportsPositionSticky() {
    if (!window.getComputedStyle) {
        return false;
    }

    const testNode = document.createElement("div");

    return ["", "-webkit-", "-moz-", "-ms-"].some((prefix) => {
        try {
            testNode.style.position = prefix + "sticky";
        }
        catch (e) {
            // Fail silently
        }

        return testNode.style.position !== "";
    });
}
