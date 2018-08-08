/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../config";
import BasePreview from "../preview";
import WysiwygFactory from "../wysiwyg-factory";
import {WysiwygInterface} from "../wysiwyg-interface";

/**
 * @api
 */
export default class Preview extends BasePreview {
    /**
     * Wysiwyg instance
     */
    private wysiwyg: WysiwygInterface;

    /**
     * The element the text content type is bound to
     */
    private element: HTMLElement;

    /**
     * @returns {Boolean}
     */
    public isWysiwygSupported(): boolean {
        return Config.getConfig("can_use_inline_editing_on_stage");
    }

    /**
     * @param {HTMLElement} element
     */
    public initWysiwyg(element: HTMLElement) {
        this.element = element;

        element.id = this.parent.id + "-editor";

        const wysiwygConfig = $.extend(true, {}, this.config.additional_data.wysiwygConfig.wysiwygConfigData);
        wysiwygConfig.additional.mode = "inline";

        WysiwygFactory(
            this.parent.id,
            element.id,
            this.config.name,
            wysiwygConfig,
            this.parent.dataStore,
            "content",
        ).then((wysiwyg: WysiwygInterface): void => {
            this.wysiwyg = wysiwyg;
        });
    }
}
