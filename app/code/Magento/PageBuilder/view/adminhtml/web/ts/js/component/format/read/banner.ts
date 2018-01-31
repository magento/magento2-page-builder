/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../../component/config";
import {DataObject} from "../../data-store";
import Colors from "../../../utils/colors";
import ReadInterface from "../read-interface";

interface ImageObject {
    name: string;
    size: number;
    type: string;
    url: string;
}

export default class Banner implements ReadInterface {

    /**
     * Fetch the image object
     *
     * @param {string} src
     * @returns {ImageObject}
     */
    private static generateImageObject(src: string): string | ImageObject[] {
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

    /**
     * Get overlay color
     *
     * @returns string
     */
    private static getOverlayColor(value: string) {
        if (value === "transparent") {
            return "";
        } else {
            return Colors.toHex(value);
        }
    }

    /**
     * Get overlay transparency
     *
     * @returns string
     */
    private static getOverlayTransparency(value: string) {
        if (value === "transparent") {
            return "0";
        } else {
            return Banner.extractAlphaFromRgba(value);
        }
    }

    /**
     * Extract the Alpha component from RGBA and convert from decimal to percent for overlay transparency
     *
     * @returns int
     */
    private static extractAlphaFromRgba(value: string) {
        const a = parseFloat(value.match(/\d+/g)[3] + "." + value.match(/\d+/g)[4]) || 1;
        return Math.floor(a * 100);
    }

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const target = element.querySelector("a").getAttribute("target");
        const bgImage = element.querySelector(".pagebuilder-banner-image").getAttribute("style").split(";")[0];
        const bgMobileImageEl = element.querySelector(".pagebuilder-banner-mobile");
        const bgMobileImage = element.querySelector(".pagebuilder-banner-mobile").getAttribute("style").split(";")[0];
        const overlayColor = element.querySelector(".pagebuilder-poster-overlay").getAttribute("data-background-color");
        const response: DataObject = {
            background_size: element.style.backgroundSize,
            button_text: element.dataset.buttonText,
            image: Banner.generateImageObject(bgImage),
            link_url: element.querySelector("a").getAttribute("href"),
            message: element.querySelector(".pagebuilder-poster-content div").innerHTML,
            minimum_height: element.querySelector(".pagebuilder-banner-wrapper").style.minHeight.split("px")[0],
            mobile_image: bgMobileImageEl ? Banner.generateImageObject(bgMobileImage) : "",
            open_in_new_tab: target && target === "_blank" ? "1" : "0",
            overlay_color: Banner.getOverlayColor(overlayColor),
            overlay_transparency: Banner.getOverlayTransparency(overlayColor),
            show_button: element.getAttribute("data-show-button"),
            show_overlay: element.getAttribute("data-show-overlay"),
        };
        return Promise.resolve(response);
    }
}
