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
        const attributeLinkType = button.getAttribute("data_attribute_link_type");
        let href = button.getAttribute("href");

        switch (attributeLinkType) {
            case "category":
                href = this.readFromCategoryWidget(href);
                break;
            case "product":
                href = this.readFromProductWidget(href);
            default:
                break;
        }

        const buttonObject: DataObject = {
            [attributeLinkType]: href,
            setting: button.target === "_blank" ? true : false,
            type: attributeLinkType,
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

    /**
     * Convert category widget string to plain href string
     *
     * @param {string} href
     * @returns {string}
     */
    private readFromCategoryWidget(href: string): string {
        const matches = href.match(/id_path=['"]category\/(\d+)/);

        if (!matches) {
            return href;
        }

        return matches[1];
    }

    /**
     * Convert product widget string to plain href string
     *
     * @param {string} href
     * @returns {string}
     */
    private readFromProductWidget(href: string): string {
        const matches = href.match(/id_path=['"]product\/(\d+)/);

        if (!matches) {
            return href;
        }

        return matches[1];
    }

}
