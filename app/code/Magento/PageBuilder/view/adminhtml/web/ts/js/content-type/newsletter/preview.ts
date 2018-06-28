/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "uiEvents";
import Config from "../../config";
import BasePreview from "../preview";

export default class Preview extends BasePreview {
    /**
     * @inheritdoc
     */
    protected afterObservablesUpdated(): void {
        super.afterObservablesUpdated();
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

        $.post(url, requestData, (response) => {
            if (typeof response.data !== "object" || typeof response.data.content === "undefined") {
                return;
            }
            this.data.main.html(response.data.content.trim());
        });
    }
}
