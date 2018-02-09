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
        const mainImageElement: Element | null = element.querySelector("img:nth-child(1)");
        const imageLinkElement: Element | null = element.querySelector("a");
        const captionElement: Element | null = element.querySelector("figcaption");
        const response: DataObject = {
            alt: mainImageElement.alt,
            image: decodeUrl(
                mainImageElement.getAttribute("src") || "",
            ),
            image_caption: captionElement ? captionElement.textContent : "",
            link_target: imageLinkElement ? imageLinkElement.target : "",
            link_url: imageLinkElement ? imageLinkElement.getAttribute("href") : "",
            mobile_image: "",
            title_tag: mainImageElement.title,
        };

        // Detect if there is a mobile image and update the response
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
