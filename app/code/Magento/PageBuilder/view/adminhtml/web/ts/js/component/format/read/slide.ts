/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ReadInterface} from "../read-interface";
import Default from "./default";

interface SlideObject {
    link_text: string;
    link_url: string;
    title: string;
    content: string;
    background_image?: string;
    has_overlay_background?: string;
}

export default class Slide implements ReadInterface {
    private defaultReader: Default = new Default();

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<SlideObject> {
        const response: SlideObject = {
            content: element.querySelector("h3").nextSibling.innerHTML,
            link_text: element.querySelector("a") !== null ?
                element.querySelector("a").firstChild.firstChild.innerText : "",
            link_url: element.querySelector("a") !== null ?
                element.querySelector("a").getAttribute("href") : "",
            title: element.querySelector("h3").innerText,
        };
        const slideAttributeElement = element.querySelector("div");
        const slideAttributesPromise = this.defaultReader.read(slideAttributeElement);

        return slideAttributesPromise.then((slideAttributes) => {
            return Promise.resolve(Object.assign(slideAttributes, response));
        });
    }
}
