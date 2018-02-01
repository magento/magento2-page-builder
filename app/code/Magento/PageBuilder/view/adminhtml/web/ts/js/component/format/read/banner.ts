/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../../component/config";
import {DataObject} from "../../data-store";
import ReadInterface from "../read-interface";
import {decodeUrl} from "../../../utils/image";

export default class Banner implements ReadInterface {
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
            image: decodeUrl(bgImage),
            link_url: element.querySelector("a").getAttribute("href"),
            message: element.querySelector(".pagebuilder-poster-content div").innerHTML,
            minimum_height: element.querySelector(".pagebuilder-banner-wrapper").style.minHeight.split("px")[0],
            mobile_image: bgMobileImageEl ? decodeUrl(bgMobileImage) : "",
            open_in_new_tab: target && target === "_blank" ? "1" : "0",
            overlay_color: this.getOverlayColor(overlayColor),
            overlay_transparency: this.getOverlayTransparency(overlayColor),
            show_button: element.getAttribute("data-show-button"),
            show_overlay: element.getAttribute("data-show-overlay"),
        };
        return Promise.resolve(response);
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
}
