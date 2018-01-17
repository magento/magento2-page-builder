/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../../component/config";
import {DataObject} from "../../data-store";
import ReadInterface from "../read-interface";

interface ImageObject {
    name: string;
    size: number;
    type: string;
    url: string;
}

export default class Banner implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const target = element.querySelector("a").getAttribute("target");
        const response: DataObject = {
            alt: element.querySelector("img:nth-child(1)").getAttribute("alt"),
            image: this.generateImageObject(
                element.querySelector("img:nth-child(1)").getAttribute("src")),
            link_text: element.querySelector("a>div") === null ?
                "" : element.querySelector("a>div").innerHTML,
            link_url: element.querySelector("a").getAttribute("href"),
            mobile_image: "",
            open_in_new_window: target && target === "_blank" ? "1" : "0",
            title_tag: element.querySelector("a").getAttribute("title"),
        };

        // Detect if there is a mobile image and update the response
        if (element.querySelector("img:nth-child(2)")
            && element.querySelector("img:nth-child(2)").getAttribute("src")) {
            response.mobile_image =
                this.generateImageObject(element.querySelector("img:nth-child(2)").getAttribute("src"));
        }

        return Promise.resolve(response);
    }

    /**
     * Magentorate the image object
     *
     * @param {string} src
     * @returns {ImageObject}
     */
    private generateImageObject(src: string): string | ImageObject[] {
        // Match the URL & type from the directive
        if (/{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.test(decodeURIComponent(src))) {
            const [, url, type] = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(decodeURIComponent(src));

            return [
                {
                    name: url.split("/").pop(),
                    size: 0,
                    type: "image/" + type,
                    url: Config.getInitConfig("media_url") + url,
                },
            ];
        }

        return "";
    }
}
