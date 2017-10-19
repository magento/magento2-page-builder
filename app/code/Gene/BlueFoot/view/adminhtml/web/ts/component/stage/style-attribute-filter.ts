/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../data-store";

export default class StyleAttributeFilter {
    /**
     * Filter style properties from array and format object keys
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
                    let value = data[key];
                    if (key === 'min_height') {
                        value = value + 'px';
                    }
                    if (key === 'background_repeat') {
                        value = value ? 'repeat' : 'no-repeat';
                    }
                    result[this.fromSnakeToCamelCase(key)] = value;
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
    private fromSnakeToCamelCase(string: string): string {
        let parts = string.split(/[_-]/);
        let newString = '';
        for (let i = 1; i < parts.length; i++) {
            newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
        }
        return parts[0] + newString;
    }
}
