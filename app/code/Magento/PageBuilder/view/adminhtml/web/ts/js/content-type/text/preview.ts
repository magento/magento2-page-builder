/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
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
     * @param {HTMLElement} element
     */
    public initWysiwyg(element: HTMLElement) {
        if (!Config.getConfig("can_use_inline_editing_on_stage")) {
            return;
        }

        this.element = element;

        element.id = this.parent.id + "-editor";

        WysiwygFactory(
            this.parent.id,
            element.id,
            this.config.name,
            this.config.additional_data.wysiwygConfig.wysiwygConfigData,
            this.parent.dataStore,
        ).then((wysiwyg: WysiwygInterface): void => {
            this.wysiwyg = wysiwyg;
        });
    }
}
