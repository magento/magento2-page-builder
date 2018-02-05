/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import extractAlphaFromRgba from "../../../utils/extract-alpha-from-rgba";
import {decodeUrl} from "../../../utils/image";
import {DataObject} from "../../data-store";
import {ReadInterface} from "../read-interface";
import {toHex} from "../../../utils/color-converter";

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
        const overlayColor = element.querySelector(".pagebuilder-poster-overlay").getAttribute("data-overlay-color");
        const response: DataObject = {
            background_size: element.style.backgroundSize,
            button_text: element.dataset.buttonText,
            image: decodeUrl(bgImage),
            link_url: element.querySelector("a").getAttribute("href"),
            message: element.querySelector(".pagebuilder-poster-content div").innerHTML,
            min_height: element.querySelector(".pagebuilder-banner-wrapper").style.minHeight.split("px")[0],
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
    private getOverlayColor(value: string) {
        return value === "transparent" ? "" : toHex(value);
    }

    /**
     * Get overlay transparency
     *
     * @returns string
     */
    private getOverlayTransparency(value: string) {
        return value === "transparent" ? "0" : extractAlphaFromRgba(value);
    }
}
