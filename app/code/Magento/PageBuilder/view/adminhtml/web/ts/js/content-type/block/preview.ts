/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "uiEvents";
import Config from "../../config";
import BasePreview from "../preview";

export default class Preview extends BasePreview {
    private messages = {
        NOT_SELECTED: $t("Block Not Selected"),
        LOADING: $t("Loading..."),
        UNKNOWN_ERROR: $t("An unknown error occurred. Please try again."),
    };
    public displayPreview: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string> = ko.observable(this.messages.NOT_SELECTED);

    /**
     * Bind events
     */
    protected bindEvents() {
        super.bindEvents();

        // When a block type is dropped for the first time open the edit panel
        events.on("block:contentType:dropped:create", (event: Event, params: { [key: string]: any }) => {
            if (event.id === this.parent.id) {
                setTimeout(() => {
                    this.edit.open();
                }, 300);
            }
        });

        events.on("previewObservables:updated", (event, params) => {
            if (event.preview.parent.id !== this.parent.id) {
                return;
            }
            this.placeholderText(this.messages.LOADING);
            this.displayPreview(false);

            const data = this.parent.dataStore.get();

            if (!data.block_id || data.template.length === 0) {
                this.placeholderText(this.messages.NOT_SELECTED);

                return;
            }

            const url = Config.getConfig("preview_url");
            const requestConfig = {
                method: "GET",
                data: {
                    role: this.config.name,
                    block_id: data.block_id,
                    directive: this.data.main.html(),
                },
            };

            // Retrieve a state object representing the block from the preview controller and process it on the stage
            $.ajax(url, requestConfig)
                .done((response) => {
                    const content = response.content !== undefined ? response.content.trim() : "";

                    // Empty content means something bad happened in the controller that didn't trigger a 5xx
                    if (content.length === 0) {
                        this.placeholderText(this.messages.UNKNOWN_ERROR);

                        return;
                    }

                    // The state object will contain the block name and either html or a message why there isn't any.
                    const blockData = $.parseJSON(content);

                    // Update the stage content type label with the real block title if provided
                    this.displayLabel(blockData.title ? blockData.title : this.config.label);

                    if (blockData.html) {
                        this.displayPreview(true);
                        this.data.main.html(blockData.html);
                    } else if (blockData.error_message) {
                        this.placeholderText(blockData.error_message);
                    }
                })
                .fail(() => {
                    this.placeholderText(this.messages.UNKNOWN_ERROR);
                });
        });
    }
}
