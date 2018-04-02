/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";
import Block from "./block";

export default class ContentBlock extends Block {
    public editOnInsert: boolean = false;

    protected afterDataRendered() {
        const attributes = this.data.main.attributes();
        if (attributes["data-identifier"] === "") {
            return;
        }
        const url = Config.getInitConfig("preview_url");
        const requestData = {
            identifier: attributes["data-identifier"],
            role: this.config.name
        };

        jQuery.post(url, requestData, (response) => {
            this.data.main.html(response.content !== undefined ? response.content.trim() : "");
        });
    }
}
