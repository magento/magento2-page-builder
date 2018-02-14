/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";

export default class Buttons extends PreviewBlock {

    /**
     * Add initial button-item if children is empty
     *
     * @param element
     */
    public afterChildrenRender(element) {
        if (this.parent.children().length === 0) {
            this.parent.addButton();
        }
    }
}
