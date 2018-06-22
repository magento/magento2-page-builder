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
            this.displayPreview(false);

            const data = this.parent.dataStore.get();

            if (!data.block_id || data.template.length === 0) {
                return;
            }

            const url = Config.getConfig("preview_url");
            const requestData = {
                role: this.config.name,
                block_id: data.block_id,
                directive: this.data.main.html(),
            };

            $.post(url, requestData, (response) => {
                const content = response.content !== undefined ? response.content.trim() : "";
                if (content.length === 0) {
                    return;
                }

                const blockData = $.parseJSON(content);

                this.displayLabel(blockData.name ? blockData.name : this.config.label);

                if (blockData.html) {
                    this.displayPreview(true);
                    this.data.main.html(blockData.html);
                } else if (blockData.message) {
                    this.placeholderText(blockData.message);
                }
            });
        });
    }
}
