/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";
import Block from "./block";

export default class Product extends Block {

    protected afterDataRendered() {
        const attributes = this.data.main.attributes();
        if (attributes["data-sku"] === "") {
            return;
        }
        const url = Config.getInitConfig("preview_url");
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
}
