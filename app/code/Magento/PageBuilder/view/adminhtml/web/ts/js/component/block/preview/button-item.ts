/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import Preview from "../../../preview";
import {ConfigContentBlock} from "../../config";
import Block from "../block";

export default class Button extends Preview {
    private buttonPlaceholder: string = $t("Edit Button Text");

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
