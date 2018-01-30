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
            background_size: element.style.backgroundSize,
            button_text: element.dataset.buttonText,
            image: this.generateImageObject(
                element.querySelector(".pagebuilder-banner-image").getAttribute("style").split(";")[0]),
            link_url: element.querySelector("a").getAttribute("href"),
            message: element.querySelector(".pagebuilder-poster-content div").innerHTML,
            minimum_height: element.querySelector(".pagebuilder-banner-wrapper").style.minHeight.split("px")[0],
            mobile_image:
                element.querySelector(".pagebuilder-banner-mobile") ?
                this.generateImageObject(element.querySelector(".pagebuilder-banner-mobile")
                    .getAttribute("style")
                    .split(";")[0]) : "",
            open_in_new_tab: target && target === "_blank" ? "1" : "0",
            overlay_color:
                element.querySelector(".pagebuilder-poster-overlay")
                    .getAttribute("data-background-color") === "transparent" ?
                    "" : this.convertRgbaToHex(
                        element.querySelector(".pagebuilder-poster-overlay")
                            .getAttribute("data-background-color"),
                    ),
            overlay_transparency:
                element.querySelector(".pagebuilder-poster-overlay")
                    .getAttribute("data-background-color") === "transparent" ?
                    "0" : this.extractAlphaFromRgba(
                        element.querySelector(".pagebuilder-poster-overlay")
                            .getAttribute("data-background-color"),
                    ),
            show_button: element.getAttribute("data-show-button"),
            show_overlay: element.getAttribute("data-show-overlay"),
        };
        return Promise.resolve(response);
    }

    /**
     * Convert RGBA to HEX for content overlay color
     *
     * @returns string
     */
    private convertRgbaToHex(value: string) {
        const values = value.match(/\d+/g);
        const r = parseInt(values[0], 10).toString(16);
        const g = parseInt(values[1], 10).toString(16);
        const b = parseInt(values[2], 10).toString(16);
        return this.padZero(r) + this.padZero(g) + this.padZero(b);
    }

    /**
     * Adds 0 if hex value is string character
     *
     * @returns string
     */
    private padZero(value: string) {
        if (value.length === 1) {
            value = "0" + value;
        }
        return value;
    }

    /**
     * Extract the Alpha component from RGBA and convert from decimal to percent for overlay transparency
     *
     * @returns int
     */
    private extractAlphaFromRgba(value: string) {
        const a = parseFloat(value.match(/\d+/g)[3] + "." + value.match(/\d+/g)[4]) || 1;
        return Math.floor(a * 100);
    }

    /**
     * Fetch the image object
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
