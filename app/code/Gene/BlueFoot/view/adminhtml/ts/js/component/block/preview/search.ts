/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Block from "../block";
import PreviewBlock from "./block";
import Config from "../../config";

export default class Search extends PreviewBlock {
    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config)
        this.updateDataValue('html', ko.observable(''));
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                if (this.data.placeholder() === '') {
                    return;
                }
                const url = Config.getInitConfig('preview_url'),
                    requestData = {
                        role: this.config.name,
                        'placeholder': this.data.placeholder
                    };

                jQuery.post(url, requestData, (response) => {
                    this.updateDataValue('html', response.content !== undefined ? response.content.trim() : '');
                });
            },
            this.parent.id
        );
    }
}
