/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class DomAttributeMapper {
    fromDom(object) {
        let result = {};
        Object.keys(object).map(
            function (key: any) {
                let value = object[key];
                if (key === 'minHeight') {
                    value = value.replace('px', '');
                }
                if (key === 'backgroundRepeat') {
                    value = value === 'repeat' ? '1' : '0';
                }
                if (key === 'backgroundColor') {
                    const regexp = /(\d{3}),\s(\d{3}),\s(\d{3})/
                    let matches = regexp.exec(value)
                    value = '#'
                        + this.toHex(parseInt(matches[1]))
                        + this.toHex(parseInt(matches[2]))
                        + this.toHex(parseInt(matches[1]));
                }
                result[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = value;
            }.bind(this)
        );
        return result;
    }

    private toHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    toDom(object) {
        let result: any = {};
        Object.keys(object).map(
            function (key: string) {
                if (key === 'role') {
                    //key = 'data_role'
                }
                result[this.fromSnakeToCamelCase(key)] = object[key];
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
}