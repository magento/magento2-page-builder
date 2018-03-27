/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import {ConfigContentBlock} from "../../config";
import Block from "../block";
import PreviewBlock from "./block";

export default class Button extends PreviewBlock {
    private buttonText: KnockoutObservable<string>;
    private buttonPlaceholder: string = $t("Edit Button Text");

    /**
     * Button constructor
     *
     * @param {Block} parent
     * @param {object} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);
        this.buttonText = this.data.button_text;
        this.buttonText.subscribe(this.onButtonTextChange.bind(this));
    }

    /**
     * Update store on button text listener
     *
     * @param {string} value
     */
    private onButtonTextChange(value: string) {
        const data = this.parent.stage.store.get(this.parent.id);

        data.button_text = value;
        this.parent.stage.store.update(this.parent.id, data);
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
