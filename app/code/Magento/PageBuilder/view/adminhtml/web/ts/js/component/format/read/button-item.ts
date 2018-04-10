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
        const button = element.getElementsByTagName("a")[0];
        const advancedData = this.defaultReader.read(button);
        const buttonObject: DataObject = {
            [button.getAttribute("data-link-type")]: button.getAttribute("href"),
            setting: button.target === "_blank" ? true : false,
            type: button.getAttribute("data-link-type"),
        };

        const response: DataObject = {
            button_link: buttonObject,
            button_text: button.innerText,
            button_type: button.classList[0],
        };
        return advancedData.then((data) => {
            delete data.css_classes;
            return Object.assign(data, response);
        });
    }
}
