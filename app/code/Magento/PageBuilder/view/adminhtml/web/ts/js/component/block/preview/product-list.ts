/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {Dictionary} from "underscore";
import Config from "../../config";
import Block from "../block";
import PreviewBlock from "./block";

export default class ProductList extends PreviewBlock {
    /**
     * Product constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
        this.updateDataValue("html", "");
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                if (this.data.category_id() === "") {
                    return;
                }
                const url = Config.getInitConfig("preview_url");
                const requestData = {
                    category_id: data.category_id,
                    hide_out_of_stock: data.hide_out_of_stock,
                    is_preview: true,
                    product_count: data.product_count,
                    role: this.config.name,
                };

                jQuery.post(url, requestData, (response) => {
                    this.updateDataValue("html", response.content !== undefined ? response.content.trim() : "");
                });
            },
            this.parent.id,
        );
    }
}
