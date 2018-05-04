/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import Config from "../../config";
import BasePreview from "../preview";

export default class Preview extends BasePreview {

    /**
     * Bind events
     */
    protected bindEvents() {
        super.bindEvents();
        events.on("previewObservables:updated", (args) => {
            if (args.preview.parent.id === this.parent.id) {
                const attributes = this.data.main.attributes();
                if (attributes["data-sku"] === "") {
                    return;
                }
                const url = Config.getConfig("preview_url");
                const requestData = {
                    is_preview: true,
                    role: this.config.name,
                    sku: attributes["data-sku"],
                    view_mode: attributes["data-view-mode"],
                };

                jQuery.post(url, requestData, (response) => {
                    this.data.main.html(response.content !== undefined ? response.content.trim() : "");
                });
            }
        });
    }
}
