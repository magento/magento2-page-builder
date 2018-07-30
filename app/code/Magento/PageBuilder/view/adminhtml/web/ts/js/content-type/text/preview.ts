/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../config";
import BasePreview from "../preview";
import Wysiwyg from "../wysiwyg";
import wysiwygConfigFactory from "../wysiwyg-config-factory";

/**
 * @api
 */
export default class Preview extends BasePreview {

    /**
     * Wysiwyg instance
     */
    private wysiwyg: Wysiwyg;

    /**
     * @param {HTMLElement} element
     */
    public initWysiwyg(element: HTMLElement) {
        if (!Config.getConfig("can_use_inline_editing_on_stage")) {
            return;
        }

        const wysiwygConfig = wysiwygConfigFactory(this.config.additional_data.wysiwygConfig);

        this.wysiwyg = new Wysiwyg(
            this.parent.id,
            element.id,
            wysiwygConfig.wysiwygConfigData,
            wysiwygConfig.mode,
            this.parent.dataStore,
            wysiwygConfig.contentDataStoreKey,
        );
    }
}
