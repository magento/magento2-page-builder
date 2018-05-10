/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import {DataObject} from "../data-store";

/**
 * @deprecated
 */
export default class StyleAttributeFilter {
    // Allowed style attributes
    private allowedAttributes: [string] = [
        "align_self",
        "background_color",
        "background_image",
        "background_size",
        "background_attachment",
        "background_repeat",
        "background_position",
        "border",
        "border_style",
        "border_width",
        "border_color",
        "border_radius",
        "color",
        "display",
        "height",
        "min_height",
        "margin_bottom",
        "margin_left",
        "margin_right",
        "margin_top",
        "mobile_image",
        "padding_bottom",
        "padding_left",
        "padding_right",
        "padding_top",
        "text_align",
        "margins_and_padding",
        "width",
    ];

    /**
     * Get allowed attributes
     *
     * @returns {Array<string>}
     */
    public getAllowedAttributes(): string[] {
        return this.allowedAttributes;
    }

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    public filter(data: DataObject): DataObject {
        const result: DataObject = {};
        Object.keys(data).map(
            (key: string) => {
                if (_.values(this.allowedAttributes).indexOf(key) > -1) {
                    result[key] = data[key];
                }
            },
        );
        return result;
    }
}
