/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";
import {DataObject} from "../../data-store";

export default class Heading implements ReadInterface {
    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {DataObject | Promise<any>}
     */
    public read(element: HTMLElement): DataObject | Promise<any> {
        return {
            'heading_type': element.nodeName,
            'title': element.innerText
        };
    }
}
