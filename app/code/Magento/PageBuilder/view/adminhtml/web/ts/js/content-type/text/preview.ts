/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
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
     * @param {HTMLElement} element
     */
    public initWysiwyg(element: HTMLElement) {
        if (!Config.getConfig("can_use_inline_editing_on_stage")) {
            return;
        }

        let inlineWysiwygConfig = this.config.additional_data.inlineWysiwygConfig;

        if (inlineWysiwygConfig.encapsulateSelectorConfigKeys) {
            inlineWysiwygConfig = $.extend(true, {}, this.config.additional_data.inlineWysiwygConfig);
            _.each(inlineWysiwygConfig.encapsulateSelectorConfigKeys, (isEnabled, configKey) => {
                const configValue = inlineWysiwygConfig.wysiwygConfig.settings[configKey];

                if (!isEnabled) {
                    return;
                }

                inlineWysiwygConfig.wysiwygConfig.settings[configKey] = (
                    "#" + this.parent.id + (configValue ? " " + configValue : "")
                );
            });
        }

        this.wysiwyg = new Wysiwyg(
            this.parent.id,
            element.id,
            inlineWysiwygConfig.wysiwygConfig,
            inlineWysiwygConfig.mode,
            this.parent.dataStore,
            this.config.additional_data.inlineWysiwygConfig.contentDataStoreKey,
        );
    }
}
