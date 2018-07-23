/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import WysiwygSetup from "mage/adminhtml/wysiwyg/tiny_mce/setup";
import events from "Magento_PageBuilder/js/events";
import Config from "../../config";
import ContentTypeAfterRenderEventParamsInterface from "../content-type-after-render-event-params.d";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    /**
     * Wysiwyg adapter instance
     */
    private wysiwygAdapter: WysiwygSetup;

    public isWysiwygFocused: KnockoutObservable<boolean> = ko.observable(false);

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

            this.instantiateWysiwyg();

            // Update content in our data store after our stage preview wysiwyg gets updated
            this.wysiwygAdapter.eventBus.attachEventHandler(
                "tinymceChange",
                this.saveContentFromWysiwygToDataStore.bind(this),
            );

            this.wysiwygAdapter.eventBus.attachEventHandler(
                "tinymceFocus",
                this.hidePlaceholder.bind(this),
            );

            this.wysiwygAdapter.eventBus.attachEventHandler(
                "tinymceBlur",
                this.showPlaceholderIfContentIsEmpty.bind(this),
            );
        });
    }

    private hidePlaceholder() {
        console.log("hidePlaceholder");
        this.isWysiwygFocused(true);
    }

    private showPlaceholderIfContentIsEmpty() {
        console.log("showPlaceholderIfContentIsEmpty");
        this.isWysiwygFocused(false);
    }

    private saveContentFromWysiwygToDataStore() {
        console.log("saveContentFromWysiwygToDataStore");
        this.parent.dataStore.update(this.wysiwygAdapter.getContent(), "content");
    }

    private setContentFromDataStoreToWysiwyg() {
        console.log("setContentFromDataStoreToWysiwyg");
        this.wysiwygAdapter.setContent(this.parent.dataStore.get("content"));
    }

    private instantiateWysiwyg() {
        this.wysiwygAdapter = new WysiwygSetup(
            `${this.parent.id}-editor`,
            this.config.additional_data.inlineWysiwygConfig
        );

        this.wysiwygAdapter.setup("inline");
    }
}
