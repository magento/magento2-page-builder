/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../component/data-store";

export default class StyleAttributeFilter {
    // Allowed style attributes
    styleAttributes: Array<string> = [
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
        'margins_and_padding'
    ];

    /**
     * Filter allowed style properties from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    filter(data: DataObject): DataObject {
        let result: DataObject = {};
        Object.keys(data).map(
            (key: string) => {
                if (Object.values(this.styleAttributes).indexOf(key) > -1) {
                    result[key] = data[key];
                }
            }
        );
        return result;
    }
}
