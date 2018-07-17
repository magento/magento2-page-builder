/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../data-store";

/**
 * @deprecated
 */
export default class AttributeFilter {
    // Allowed data attributes
    private allowAttributes: string[] = [
        "element",
        "name",
        "appearance",
        "id",
        "src",
        "button_text",
        "button_type",
        "label_text",
        "placeholder",
        "title",
        "identifier",
        "view_mode",
        "sku",
        "category_id",
        "product_count",
        "show_out_of_stock",
        "autoplay",
        "autoplay_speed",
        "fade",
        "is_infinite",
        "show_arrows",
        "show_button",
        "show_dots",
        "show_overlay",
        "has_overlay_background",
        "enable_parallax",
        "parallax_speed",
        "border",
    ];

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    public filter(data: DataObject): DataObject {
        const attributes: DataObject = {};
        Object.keys(data).map(
            (key: string) => {
                if (this.allowAttributes.includes(key)) {
                    attributes[key] = data[key];
                }
            },
        );
        return attributes;
    }
}
