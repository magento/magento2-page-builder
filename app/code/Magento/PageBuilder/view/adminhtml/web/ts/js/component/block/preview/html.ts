/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $ from "jquery";
import {Dictionary} from "underscore";
import Block from "../block";
import PreviewBlock from "./block";
import Config from "../../config";


export default class Code extends PreviewBlock {
    /**
     * Constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
        this.updateDataValue("html", ko.observable(""));
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                this.updateDataValue("html", this.normalizeImageUrls(this.data.html()));
            },
            this.parent.id,
        );
    }

    /**
     * Replace media directives with actual media URLs
     *
     * @param {string} html
     * @returns {string}
     */
    normalizeImageUrls(html) {
        const container = $('<div />');
        container.append(html);
        container.find("img").each((index, value) => {
            const matches = /url="?([^"\\\s\}]+)"?/.exec($(value).attr('src'));
            if (typeof matches[1] != "undefined") {
                $(value).attr('src', Config.getInitConfig('media_url') + matches[1]);
            }
        });
        return container.html();
    }
}
