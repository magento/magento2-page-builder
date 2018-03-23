/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";

export default class Button extends PreviewBlock {
    private element: Element;

    /**
     * After child render record element
     * returns {object}
     */
    public childrenStyle(): {} {
        return {
            display: "inline-block",
        };
    }

    /**
     * Focus in of the element
     */
    private onFocusIn(): void {
    }

    /**
     * Focus out of the element
     */
    private onFocusOut(): void {
        this.parent.preview.isLiveEditing(false);
    }

    /**
     * After child render record element
     *
     * @param {Element} element
     */
    private onAfterRender(element: Element): void {
        this.element = element;
    }
}
