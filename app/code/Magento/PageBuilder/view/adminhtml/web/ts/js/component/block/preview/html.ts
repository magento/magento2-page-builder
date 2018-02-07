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


export default class Html extends PreviewBlock {
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
    normalizeImageUrls(html: string): string {
        const mediaDirectiveRegExp = /\{\{\s*media\s+url\s*=\s*"?[^"\s\}]+"?\s*\}\}/g;
        const mediaDirectiveMatches = html.match(mediaDirectiveRegExp);
        if (mediaDirectiveMatches) {
            mediaDirectiveMatches.forEach((mediaDirective: string) => {
                const urlRegExp = /\{\{\s*media\s+url\s*=\s*"?([^"\s\}]+)"?\s*\}\}/;
                const urlMatches = mediaDirective.match(urlRegExp);
                if (urlMatches && urlMatches[1] !== "undefined") {
                    html = html.replace(
                        mediaDirective,
                        Config.getInitConfig('media_url') + urlMatches[1]
                    );
                }
            });
        }
        return html;
    }
}
