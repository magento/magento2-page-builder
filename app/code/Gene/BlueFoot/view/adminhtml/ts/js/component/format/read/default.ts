/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';
import StyleAttributeMapper from "../../../utils/style-attribute-mapper";

export default class Default {
    styleAttributeMapper: StyleAttributeMapper;

    constructor() {
        this.styleAttributeMapper = new StyleAttributeMapper();
    }

    /**
     * Read data, style and css properties from the element
     *
     * @param element
     * @returns {object}
     */
    public read (element: HTMLElement): object {
        let data: any = {};
        let styleAttributes: any = {};
        for (let i = 0; i < element.style.length; i ++) {
            const property = element.style.item(i);

            if (element.style[property] !== '') {
                styleAttributes[property] = element.style[property];
            }
        }

        _.extend(data, this.styleAttributeMapper.fromDom(styleAttributes));

        Object.keys(element.dataset).map(
            function (key) {
                if (element.dataset[key] !== '') {
                    data[key] = element.dataset[key]
                }
            }
        );

        data['css_classes'] = element.className.split(' ').filter(v => v.length > 0);

        return data;
    }
}
