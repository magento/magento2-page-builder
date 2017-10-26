/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../component/data-store";

export default class StyleAttributeMapper {
    /**
     * Map style attribute keys to DOM key names and normalize values
     *
     * @param data
     * @returns {object}
     */
    toDom(data: DataObject): object {
        let result: any = {};
        Object.keys(data).map(
            function (key: string) {
                let value = data[key];
                if (key === 'min_height') {
                    value = value.replace('px', '') + 'px';
                }
                if (key === 'width') {
                    value = value.replace('%', '') + '%';
                }
                if (key === 'background_repeat') {
                    value = value ? 'repeat' : 'no-repeat';
                }
                result[this.fromSnakeToCamelCase(key)] = value;
            }.bind(this)
        );
        return result;
    }

    /**
     * Map DOM key names and values to internal format
     *
     * @param object
     * @returns {{}}
     */
    public fromDom(object) {
        let result = {};
        Object.keys(object).map(
            function (key: any) {
                let value = object[key];
                if (key === 'minHeight') {
                    value = value.replace('px', '');
                }
                if (key === 'width') {
                    value = value.replace('%', '');
                }
                if (key === 'backgroundRepeat') {
                    value = value === 'repeat' ? '1' : '0';
                }
                if (key === 'backgroundColor') {
                    const regexp = /(\d{3}),\s(\d{3}),\s(\d{3})/
                    let matches = regexp.exec(value)
                    value = '#'
                        + this.fromIntToHex(parseInt(matches[1]))
                        + this.fromIntToHex(parseInt(matches[2]))
                        + this.fromIntToHex(parseInt(matches[1]));
                }
                result[this.fromCamelToSnakeCase(key)] = value;
            }.bind(this)
        );
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

    /**
     * Convert from camel to snake case
     *
     * @param string
     * @returns {string}
     */
    private fromCamelToSnakeCase(string: string): string {
        return string.split(/(?=[A-Z])/).join('_').toLowerCase();
    }

    /**
     * Convert from int to hex
     *
     * @param value
     * @returns {string}
     */
    private fromIntToHex(value) {
        let hex = value.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }
}
