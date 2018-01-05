/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Block from "../block";
import PreviewBlock from "./block";
import Config from "../../config";
import {Dictionary} from "underscore";
'use strict';

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
                        view_mode: this.data.view_mode,
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
