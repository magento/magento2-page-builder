/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Block from "../block";
import PreviewBlock from "./block";
import Config from "../../config";
import {Dictionary} from "underscore";

export default class Product extends PreviewBlock {

    /**
     * Product constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config)
        this.updateDataValue('html', '');
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                if (this.data.sku() === '') {
                    return;
                }
                const url = Config.getInitConfig('preview_url'),
                    requestData = {
                        role: this.config.name,
                        sku: this.data.sku,
                        is_preview: true
                    };

                jQuery.post(url, requestData, (response) => {
                    this.updateDataValue('html', response.content !== undefined ? response.content.trim() : '');
                });
            },
            this.parent.id
        );
    }
}
