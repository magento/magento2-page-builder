/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';
import ReadInterface from "../read-interface";
import {DataObject} from "../../data-store";
import StyleAttributeMapper from "../../../utils/style-attribute-mapper";

export default class Default implements ReadInterface {
    styleAttributeMapper: StyleAttributeMapper;

    constructor() {
        this.styleAttributeMapper = new StyleAttributeMapper();
    }

    /**
     * Read data, style and css properties from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read (element: HTMLElement): Promise<any> {
        let data: DataObject = {};
        let styleAttributes: DataObject = {};
        Object.keys(element.style).map(
            function (key: any) {
                if (isNaN(key) && element.style[key] !== '') {
                    styleAttributes[key] = element.style[key];
                }
            }
        );

        _.extend(data, this.styleAttributeMapper.fromDom(styleAttributes));

        Object.keys(element.dataset).map(
            function (key) {
                if (element.dataset[key] !== '') {
                    data[key] = element.dataset[key]
                }
            }
        );

        data['css_classes'] = element.className.split(' ');

        return new Promise((resolve: Function) => {
            resolve(data);
        });
    }
}
