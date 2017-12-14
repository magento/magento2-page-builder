/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../data-store";
import {toDataObject, filterAttributes} from "../../utils/data-object";

export default class AttributeFilter {
    allowedAttributes: DataObject = toDataObject([
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
    ]);

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    filter(data: DataObject): DataObject {
        return filterAttributes(data, this.allowedAttributes)
    }
}
