/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../component/config";
import EventBus from "../../component/event-bus";
import BasePreview from "../../preview";

export default class Preview extends BasePreview {
    /**
     * Bind events
     */
    protected bindEvents() {
        super.bindEvents();
        EventBus.on("previewObservables:updated", (event, params) => {
            if (params.preview.parent.id === this.parent.id) {
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
