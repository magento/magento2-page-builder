/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import _ from "underscore";
import events from "Magento_PageBuilder/js/events";
import Config from "../../config";
import ContentTypeAfterRenderEventParamsInterface from "../content-type-after-render-event-params.d";
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
                if (isEnabled) {
                    inlineWysiwygConfig.wysiwygConfig.settings[configKey] =
                        `#${this.parent.id} ${inlineWysiwygConfig.wysiwygConfig.settings[configKey]}`;
                }
            });
        }

        this.wysiwyg = new Wysiwyg(
            element.id,
            inlineWysiwygConfig.wysiwygConfig,
            "inline",
        );

        // Update content in our data store after our stage preview wysiwyg gets updated
        this.wysiwyg.onEdited(this.saveContentFromWysiwygToDataStore.bind(this));

        // Update content in our stage preview wysiwyg after its slideout counterpart gets updated
        events.on(`form:${this.parent.id}:saveAfter`, this.setContentFromDataStoreToWysiwyg.bind(this));
    }

    /**
     * Update content in our data store after our stage preview wysiwyg gets updated
     */
    private saveContentFromWysiwygToDataStore() {
        console.log("saveContentFromWysiwygToDataStore");
        this.parent.dataStore.update(
            this.wysiwyg.getAdapter().getContent(),
            this.config.additional_data.inlineWysiwygConfig.contentDataStoreKey,
        );
    }

    /**
     * Update content in our stage wysiwyg after our data store gets updated
     */
    private setContentFromDataStoreToWysiwyg() {
        console.log("setContentFromDataStoreToWysiwyg");
        this.wysiwyg.getAdapter().setContent(
            this.parent.dataStore.get(this.config.additional_data.inlineWysiwygConfig.contentDataStoreKey),
        );
    }
}
