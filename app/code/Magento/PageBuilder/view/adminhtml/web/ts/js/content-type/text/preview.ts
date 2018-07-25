/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import _ from "underscore";
import events from "Magento_PageBuilder/js/events";
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
                    this.parent.id + (configValue ? " " + configValue : "")
                );
            });
        }

        this.wysiwyg = new Wysiwyg(
            element.id,
            inlineWysiwygConfig.wysiwygConfig,
            inlineWysiwygConfig.mode,
        );

        // Update content in our data store after our stage preview wysiwyg gets updated
        this.wysiwyg.onEdited(this.saveContentFromWysiwygToDataStore.bind(this));

        // prevent interactability with options when in inline editing mode
        this.wysiwyg.onFocused(events.trigger.bind(null, "stage:interactionStart"));

        // resume normal interactability with opens when leaving inline editing mode
        this.wysiwyg.onBlurred(events.trigger.bind(null, "stage:interactionStop"));

        // Update content in our stage preview wysiwyg after its slideout counterpart gets updated
        events.on(`form:${this.parent.id}:saveAfter`, this.setContentFromDataStoreToWysiwyg.bind(this));
    }

    /**
     * Update content in our data store after our stage preview wysiwyg gets updated
     */
    private saveContentFromWysiwygToDataStore() {
        this.parent.dataStore.update(
            this.wysiwyg.getAdapter().getContent(),
            this.config.additional_data.inlineWysiwygConfig.contentDataStoreKey,
        );
    }

    /**
     * Update content in our stage wysiwyg after our data store gets updated
     */
    private setContentFromDataStoreToWysiwyg() {
        this.wysiwyg.getAdapter().setContent(
            this.parent.dataStore.get(this.config.additional_data.inlineWysiwygConfig.contentDataStoreKey),
        );
    }
}
