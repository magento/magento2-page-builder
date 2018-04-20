/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import Config from "../config";
import Block from "./block";

export default class ContentBlock extends Block {
    public editOnInsert: boolean = false;

    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        super.bindEvents();

        events.on("previewObservables:updated", (args) => {
            if (args.preview.id === this.id) {
                const attributes = this.data.main.attributes();
                if (attributes["data-identifier"] === "") {
                    return;
                }
                const url = Config.getInitConfig("preview_url");
                const requestData = {
                    identifier: attributes["data-identifier"],
                    role: this.config.name,
                };

                jQuery.post(url, requestData, (response) => {
                    this.data.main.html(response.content !== undefined ? response.content.trim() : "");
                });
            }
        });
    }
}
