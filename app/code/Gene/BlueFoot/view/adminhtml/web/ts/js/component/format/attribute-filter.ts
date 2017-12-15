/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../data-store";

export default class AttributeFilter {
    // Allowed data attributes
    allowedAttributes: DataObject = [
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
        'has_overlay_background',
        'enable_parallax',
        'parallax_speed'
    ].reduce((acc: any, next: string) => {
        acc[next] = true;
        return acc;
    }, {});

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    filter(data: DataObject): DataObject {
        let result: DataObject = {};
        for (let key in data) {
            if (this.allowedAttributes[key]) {
                result[key] = data[key];
            }
        }
        return result;
    }
}
