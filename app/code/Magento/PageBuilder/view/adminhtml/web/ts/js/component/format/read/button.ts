/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import {DataObject} from "../../data-store";
import {ReadInterface} from "../read-interface";

export default class Button implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const response: DataObject = {
            button_link: element.getElementsByTagName('a')[0].getAttribute("href"),
            button_text: element.getAttribute("data-button-text"),
            button_type: element.getAttribute("data-button-type"),
            open_in_new_tab: element.getElementsByTagName('a')[0].getAttribute("target") === "_blank" ? '1': '0',
        };
        return Promise.resolve(response);
    }
}
