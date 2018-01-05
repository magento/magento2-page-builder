/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";
import Config from "../../../component/config";
import _ from 'underscore';
import {DataObject} from "../../data-store";
'use strict';
/*eslint-disable */
interface SlideObject {
    link_text: string;
    link_url: string;
    title: string;
    content: string;
    background_image?: string;
    has_overlay_background?: string;
}

export default class Slide implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<SlideObject> {
        let target = element.firstChild,
            response: SlideObject = {
            link_text: element.querySelector('a') !== null ? element.querySelector('a').firstChild.firstChild.innerText : "",
            link_url: element.querySelector('a') !== null ? element.querySelector('a').getAttribute('href'): "",
            title: element.querySelector('h3').innerText,
            content: element.querySelector('h3').nextSibling.innerHTML
        };

        return Promise.resolve(response);
    }
}
