/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../data-store";

export default class AttributeFilter {
    allowAttributes: Array<string> = [
        'name',
        'appearance',
        'id',
        'src',
        'button_text',
        'label_text',
        'placeholder',
        'title',
        'identifier',
        'view_mode',
        'sku',
        'position',
        'category_id',
        'product_count',
        'show_out_of_stock',
        'autoplay',
        'autoplay_speed',
        'fade',
        'is_infinite',
        'show_arrows',
        'show_dots',
        'advanced_settings',
        'has_overlay_background'
    ];

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    filter(data: DataObject): DataObject {
        let attributes: DataObject = {};
        Object.keys(data).map(
            (key: string) => {
                if (this.allowAttributes.includes(key)) {
                    attributes[key] = data[key];
                }
            }
        );
        return attributes;
    }
}
