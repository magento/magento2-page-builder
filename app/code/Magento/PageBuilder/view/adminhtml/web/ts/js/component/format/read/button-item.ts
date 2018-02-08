/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import {ReadInterface} from "../read-interface";
import Default from "./default";

export default class ButtonItem implements ReadInterface {
    private defaultReader: Default = new Default();

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const advancedData = this.defaultReader.read(element.querySelector(".pagebuilder-button-item"));
        const response: DataObject = {
            button_link: element.getElementsByTagName('a')[0].getAttribute("href"),
            button_text: element.getAttribute("data-button-text"),
            button_type: element.getAttribute("data-button-type"),
            open_in_new_tab: element.getElementsByTagName('a')[0].getAttribute("target") === "_blank" ? '1': '0',
        };
        return new Promise((resolve: (object: object) => void) => {
            advancedData.then((data) => {
                delete data.css_classes;
                resolve(
                    Object.assign(data, response)
                );
            });
        });
    }
}
