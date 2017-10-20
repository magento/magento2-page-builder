/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';
import DomAttributeMapper from "../../utils/dom-attribute-mapper";

export default class Default {
    domAttributeMapper: DomAttributeMapper;

    constructor() {
        this.domAttributeMapper = new DomAttributeMapper();
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
        Object.keys(element.style).map(
            function (key: any) {
                if (isNaN(key) && element.style[key] !== '') {
                    styleAttributes[key] = element.style[key];
                }
            }
        );

        _.extend(data, this.domAttributeMapper.fromDom(styleAttributes));

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
