/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

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
     * @returns {Wysiwyg}
     */
    public getWysiwyg() {
        return this.wysiwyg;
    }

    /**
     * @inheritDoc
     */
    protected bindEvents() {
        super.bindEvents();

        if (!Config.getConfig("can_use_inline_editing_on_stage")) {
            return;
        }

        // Update content in our stage preview wysiwyg after its slideout counterpart gets updated
        events.on(`form:${this.parent.id}:saveAfter`, this.setContentFromDataStoreToWysiwyg.bind(this));

        // Create wysiwyg instance after content type is rendered
        events.on(`${this.config.name}:renderAfter`, (args: ContentTypeAfterRenderEventParamsInterface) => {
            if (args.contentType.id !== this.parent.id) { // guard against re-instantiation on existing content types
                return;
            }

            this.wysiwyg = new Wysiwyg(
                this.parent.id,
                this.config.additional_data.inlineWysiwygConfig.wysiwygConfig,
                "inline",
            );

            // Update content in our data store after our stage preview wysiwyg gets updated
            this.wysiwyg.onEdited(this.saveContentFromWysiwygToDataStore.bind(this));
        });
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
