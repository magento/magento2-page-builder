/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../data-store";
import DataFilter from "./data-filter";

export default class AttributeFilter extends DataFilter {
    // Allowed data attributes
    allowedAttributes: DataObject;

    constructor() {
        super();
        this.allowedAttributes = this.toDataObject([
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
    }
}
