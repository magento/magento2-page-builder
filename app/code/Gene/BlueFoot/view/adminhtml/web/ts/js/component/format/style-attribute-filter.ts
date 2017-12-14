/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../data-store";
import DataFilter from "./data-filter";

export default class StyleAttributeFilter extends DataFilter {
    // Allowed style attributes
    allowedAttributes: DataObject;

    constructor() {
        super();
        this.allowedAttributes = this.toDataObject([
            'width',
            'height',
            'min_height',
            'background_color',
            'background_image',
            'background_size',
            'background_attachment',
            'background_repeat',
            'background_position',
            'border_style',
            'border_width',
            'border_color',
            'border_radius',
            'margin_top',
            'margin_right',
            'margin_bottom',
            'margin_left',
            'padding_top',
            'padding_right',
            'padding_bottom',
            'padding_left',
            'display',
            'align_self',
            'text_align',
            'color',
            'border',
            'margins_and_padding'
        ]);
    }
}
