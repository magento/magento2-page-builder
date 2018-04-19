/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import Config from "../config";
import Block from "./block";

export default class Newsletter extends Block {
    public editOnInsert: boolean = false;

    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        super.bindEvents();

        events.on("previewObservables:updated", (event, args) => {
            if (args.preview.id === this.id) {
                const attributes = this.data.main.attributes();
                if (attributes["data-title"] === "") {
                    return;
                }
                const url = Config.getInitConfig("preview_url");
                const requestData = {
                    button_text: attributes["data-button-text"],
                    label_text: attributes["data-label-text"],
                    placeholder: attributes["data-placeholder"],
                    role: this.config.name,
                    title: attributes["data-title"],
                };

                jQuery.post(url, requestData, (response) => {
                    this.data.main.html(response.content !== undefined ? response.content.trim() : "");
                });
            }
        });
    }
}
