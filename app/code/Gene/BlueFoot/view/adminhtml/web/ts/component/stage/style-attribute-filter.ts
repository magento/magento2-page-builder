/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class StyleAttributeFilter {
    /**
     * Filter style properties from array and format object keys
     *
     * @param data
     * @returns {object}
     */
    filter(data): object {
        let styleAttributes = [
            'width',
            'height',
            'min_height',
            'background_color',
            'background_image',
            'background_size',
            'background_attachment',
            'background_repeat',
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
        let result = {};
        Object.keys(data).map(
            function (key) {
                if (Object.values(styleAttributes).indexOf(key) > -1) {
                    result[this.fromSnakeToCamelCase(key)] = data[key]
                }
            }.bind(this)
        );
        console.log(result);
        return result;
    }

    /**
     * Convert from snake case to camel case
     *
     * @param string
     * @returns {string}
     */
    private fromSnakeToCamelCase(string) {
        let parts = string.split(/[_-]/);
        let newString = '';
        for (let i = 1; i < parts.length; i++) {
            newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
        }
        return parts[0] + newString;
    }
}
