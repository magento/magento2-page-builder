/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Preview from "../../../preview";
import Config from "../../config";
import EventBus from "../../event-bus";

export default class Newsletter extends Preview {
    /**
     * Bind events for the current instance
     */
    public bindEvents() {
        super.bindEvents();
        EventBus.on("previewObservables:updated", (event, params) => {
            if (params.preview.id === this.id) {
                const attributes = this.data.main.attributes();
                if (attributes["data-title"] === "") {
                    return;
                }
                const url = Config.getConfig("preview_url");
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
