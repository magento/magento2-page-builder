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
        console.log('read/banner.ts');
        console.log(element);
        debugger;
        const target = element.querySelector("a").getAttribute("target");
        const response: DataObject = {
            background_size: element.style.backgroundSize,
            button_text: element.dataset.buttonText,
            image: "",
            link_url: element.querySelector("a").getAttribute("href"),
            message: element.querySelector('.pagebuilder-poster-content div').innerHTML,
            minimum_height: element.querySelector('.pagebuilder-banner-wrapper').style.minHeight.split('px')[0],
            mobile_image: "",
            open_in_new_tab: target && target === "_blank" ? "1" : "0",
            overlay_color: element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor === "transparent" ? "" : this.convertRgbaToHex(element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor),
            overlay_transparency: element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor === "transparent" ? "0" : "1",
            show_button: "",
            show_overlay: ""
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
     * Convert RGBA to HEX for transparent overlay for the element
     *
     * @returns {string}
     */
    private convertRgbaToHex(value: string) {

    }

    /**
     * Convert decimal to percent for transparent overlay for the element
     *
     * @param {string} value
     * @returns {string}
     */
    private convertDecimalToPercent(value: string) {
        return (parseInt(value, 10) * 100).toString();
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
