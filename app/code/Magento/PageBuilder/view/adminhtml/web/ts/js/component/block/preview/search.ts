/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import {Dictionary} from "underscore";
import Config from "../../config";
import Block from "../block";
import PreviewBlock from "./block";

export default class Search extends PreviewBlock {
    /**
     * PreviewBlock constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
        this.updateDataValue("html", ko.observable(""));
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                if (this.data.placeholder() === "") {
                    return;
                }
                const url = Config.getInitConfig("preview_url");
                const requestData = {
                    placeholder: this.data.placeholder,
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
