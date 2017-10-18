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
                    data[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = element.style[key]
                }
            }
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
}
