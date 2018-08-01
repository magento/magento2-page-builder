/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import Config from "../../config";
import BasePreview from "../preview";
import Wysiwyg from "../wysiwyg";

/**
 * @api
 */
export default class Preview extends BasePreview {
    /**
     * Wysiwyg instance
     */
    private wysiwyg: Wysiwyg;

    /**
     * The element the text content type is bound to
     */
    private element: HTMLElement;

    /**
     * @param {HTMLElement} element
     */
    public initWysiwyg(element: HTMLElement) {
        if (!Config.getConfig("can_use_inline_editing_on_stage")) {
            return;
        }

        this.element = element;

        element.id = this.parent.id + "-editor";

        this.wysiwyg = new Wysiwyg(
            this.parent.id,
            element.id,
            this.config.additional_data.wysiwygConfig.wysiwygConfigData,
            this.parent.dataStore,
        );

        this.wysiwyg.onFocus(this.onFocus.bind(this));
        this.wysiwyg.onBlur(this.onBlur.bind(this));
    }

    /**
     * Event handler for wysiwyg focus
     * Fixes z-index issues for tabs and column
     */
    private onFocus() {
        $(this.element).closest(".tabs-content, .pagebuilder-column").css("z-index", 100);
    }

    /**
     * Event handler for wysiwyg blur
     * Fixes z-index issues for tabs and column
     */
    private onBlur() {
        $(this.element).closest(".tabs-content, .pagebuilder-column").css("z-index", "");
    }
}
