/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../component/data-store";

export default class StyleAttributeFilter {
    /**
     * Filter allowed style properties from object
     *
     * @param data
     * @returns {object}
     */
    filter(data: DataObject): object {
        let styleAttributes = [
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
            'padding_left'
        ];
        let result: any = {};
        Object.keys(data).map(
            function (key: string) {
                if (Object.values(styleAttributes).indexOf(key) > -1) {
                    result[key] = data[key];
                }
            }.bind(this)
        );
        return result;
    }
}
