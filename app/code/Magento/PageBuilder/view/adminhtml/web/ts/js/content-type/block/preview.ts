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
    public displayPreview: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string> = ko.observable($t("Block Not Selected"));

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

        events.on("previewObservables:updated", (args) => {
            if (args.preview.parent.id !== this.parent.id) {
                return;
            }
            this.placeholderText($t("Loading..."));
            this.displayPreview(false);

            const data = this.parent.dataStore.get();

            if (!data.block_id || data.template.length === 0) {
                return;
            }

            const url = Config.getConfig("preview_url");
            const requestConfig = {
                method: "GET",
                data: {
                    role: this.config.name,
                    block_id: data.block_id,
                    directive: this.data.main.html()
                }
            };

            // Retrieve a state object representing the block from the preview controller and process it on the stage
            $.ajax(url, requestConfig)
                .done((response) => {
                    const content = response.content !== undefined ? response.content.trim() : "";

                    // Empty content means something bad happened in the controller that didn't trigger a 5xx
                    if (content.length === 0) {
                        this.placeholderText($t("An unknown error occurred. Please try again."));

                        return;
                    }

                    // The state object will contain the block name and either html or a message why there isn't any.
                    const blockData = $.parseJSON(content);

                    // Update the stage content type label with the real block title if provided
                    this.displayLabel(blockData.blockTitle ? blockData.blockTitle : this.config.label);

                    if (blockData.html) {
                        this.displayPreview(true);
                        this.data.main.html(blockData.html);
                    } else if (blockData.errorMessage) {
                        this.placeholderText(blockData.errorMessage);
                    }
                })
                .fail(() => {
                    this.placeholderText($t("An unknown error occurred. Please try again."));
                });
        });
    }
}
