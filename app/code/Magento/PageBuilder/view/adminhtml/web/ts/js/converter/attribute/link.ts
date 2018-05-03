/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "../../../property/property-reader-interface";

export default class Link implements PropertyReaderInterface {

    private regexpByLinkType: object = {
        category: new RegExp(/id_path=['"]category\/(\d+)/),
        product: new RegExp(/id_path=['"]product\/(\d+)/ ),
        page: new RegExp(/page_id=['"](\d+)/),
    };

    /**
     * Read link from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement): string | object {
        let href = element.getAttribute("href");
        const attributeLinkType = element.getAttribute("data-link-type");

        if (typeof href === "string" && attributeLinkType !== "default") {
            href = this.getIdFromWidgetSyntax(href, this.regexpByLinkType[attributeLinkType]);
        }

        return {
            [attributeLinkType]: href,
            setting: element.target === "_blank",
            type: attributeLinkType,
        };
    }

    private getIdFromWidgetSyntax(href: string, regexp: RegExp): string {
        const attributeIdMatches = href.match(regexp);

        if (!attributeIdMatches) {
            return href;
        }

        return attributeIdMatches[1];
    }
}
