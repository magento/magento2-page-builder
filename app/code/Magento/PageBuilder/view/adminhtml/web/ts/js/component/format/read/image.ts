/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {decodeUrl} from "../../../utils/image";
import {DataObject} from "../../data-store";
import {ReadInterface} from "../read-interface";

export default class Image implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const imageLinkElement: Element | null = element.querySelector("a");
        const captionElement: Element | null = element.querySelector("figcaption");
        const response: DataObject = {
            alt: "",
            image: "",
            image_caption: captionElement ? captionElement.textContent : "",
            link_target: imageLinkElement ? imageLinkElement.target : "",
            link_url: imageLinkElement ? imageLinkElement.getAttribute("href") : "",
            mobile_image: "",
            title_tag: "",
        };
        if (element.querySelector("img:nth-child(1)")) {
            if (element.querySelector("img:nth-child(1)").getAttribute("src")) {
                response.image = decodeUrl(
                    element.querySelector("img:nth-child(1)").getAttribute("src"),
                );
            }
            if (element.querySelector("img:nth-child(1)").getAttribute("alt")) {
                response.alt = element.querySelector("img:nth-child(1)").getAttribute("alt");
            }
            if (element.querySelector("img:nth-child(1)").getAttribute("title")) {
                response.title_tag = element.querySelector("img:nth-child(1)").getAttribute("title");
            }
        }
        if (element.querySelector("img:nth-child(2)")
            && element.querySelector("img:nth-child(2)").getAttribute("src")
        ) {
            response.mobile_image = decodeUrl(
                element.querySelector("img:nth-child(2)").getAttribute("src"),
            );
        }

        return Promise.resolve(response);
    }
}
