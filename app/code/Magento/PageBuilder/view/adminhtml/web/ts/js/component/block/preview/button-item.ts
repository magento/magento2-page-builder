/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";

export default class Button extends PreviewBlock {
    private element: Element;

    /**
     * After child render record element
     *
     * @param {Element} element
     */
    public onAfterRender(element: Element): void {
        this.element = element;
    }
    /**
     * After child render record element
     * returns {object}
     */
    public childrenStyle(): {} {
        return {
            display: "inline-block",
        };
    }
}
