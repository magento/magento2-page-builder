/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
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
                if (attributes["data-identifier"] === "") {
                    return;
                }
                const url = Config.getConfig("preview_url");
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
