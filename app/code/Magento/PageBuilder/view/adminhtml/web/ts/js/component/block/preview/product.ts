/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {Dictionary} from "underscore";
import Config from "../../config";
import PreviewBlock from "./block";

export default class Product extends PreviewBlock {

    /**
     * Setup fields observables within the data class property
     */
    protected setupDataFields() {
        super.setupDataFields();

        this.updateDataValue("html", "");
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                if (this.data.sku() === "") {
                    return;
                }
                const url = Config.getInitConfig("preview_url");
                const requestData = {
                    is_preview: true,
                    role: this.config.name,
                    sku: this.data.sku,
                    view_mode: this.data.view_mode,
                };

                jQuery.post(url, requestData, (response) => {
                    this.updateDataValue("html", response.content !== undefined ? response.content.trim() : "");
                });
            },
            this.parent.id,
        );
    }
}
