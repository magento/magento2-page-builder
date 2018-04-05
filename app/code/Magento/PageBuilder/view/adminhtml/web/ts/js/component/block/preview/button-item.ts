/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import {ConfigContentBlock} from "../../config";
import Block from "../block";
import PreviewBlock from "./block";

export default class Button extends PreviewBlock {
    private buttonPlaceholder: string = $t("Edit Button Text");

    /**
     * Button constructor
     *
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);
    }

    /**
     * After child render record element
     * returns {object}
     */
    private childrenStyle(): {} {
        return {
            display: "inline-block",
        };
    }

    /**
     * Focus out of the element
     */
    private onFocusOut(): void {
        this.parent.parent.preview.isLiveEditing(null);
    }
}
