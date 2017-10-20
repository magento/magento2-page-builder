/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class Default {
    /**
     * Read data, style and css properties from the element
     *
     * @param element
     * @returns {object}
     */
    public read (element: HTMLElement): object {
        let data: any = {};
        Object.keys(element.style).map(
            function (key: any) {
                if (isNaN(key) && element.style[key] !== '') {
                    let value = element.style[key];
                    if (key === 'minHeight') {
                        value = value.replace('px', '');
                    }
                    if (key === 'backgroundRepeat') {
                        value = value === 'repeat' ? '1' : '0';
                    }
                    if (key === 'backgroundColor') {
                        const regexp = /(\d{3}),\s(\d{3}),\s(\d{3})/
                        let matches = regexp.exec(value)
                        value = '#'+ this.toHex(parseInt(matches[1])) + this.toHex(parseInt(matches[2])) + this.toHex(parseInt(matches[1]));
                    }
                    data[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = value;
                }
            }.bind(this)
        );

        Object.keys(element.dataset).map(
            function (key) {
                if (element.dataset[key] !== '') {
                    data[key] = element.dataset[key]
                }
            }
        );

        data['css_classes'] = element.className.split(' ');

        return data;
    }

    toHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}
