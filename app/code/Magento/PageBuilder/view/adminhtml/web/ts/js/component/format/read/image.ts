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
        const response: DataObject = {
            alt: element.querySelector("img:nth-child(1)").getAttribute("alt"),
            image: decodeUrl(
                element.querySelector("img:nth-child(1)").getAttribute("src"),
            ),
            mobile_image: "",
            image_caption: element.querySelector("figcaption").textContent,
            link_url: element.querySelector("a").getAttribute("href"),
            link_target: element.querySelector("a").getAttribute("target"),
            title_tag: element.querySelector("a").getAttribute("title"),
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
