/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {toHex} from "../../../utils/color-converter";
import extractAlphaFromRgba from "../../../utils/extract-alpha-from-rgba";
import {decodeUrl} from "../../../utils/image";
import {DataObject} from "../../data-store";
import {ReadInterface} from "../read-interface";

export default class Banner implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<object> {
        let bgMobileImage = element.querySelector(".pagebuilder-banner-mobile").style.backgroundImage;
        const target = element.querySelector("a").getAttribute("target");
        const bgImage = element.querySelector(".pagebuilder-banner-image").style.backgroundImage;
        const overlayColor = element.querySelector(".pagebuilder-poster-overlay").getAttribute("data-overlay-color");
        const paddingSrc = element.querySelector(".pagebuilder-poster-overlay").style;
        const marginSrc = element.style;
        if (bgImage === bgMobileImage) {
            bgMobileImage = false;
        }
        const response: any = {
            background_image: decodeUrl(bgImage),
            background_size: element.style.backgroundSize,
            button_text: element.dataset.buttonText,
            link_url: element.querySelector("a").getAttribute("href"),
            margins_and_padding: {
                margin: {
                    bottom: marginSrc.marginBottom.replace("px", ""),
                    left: marginSrc.marginLeft.replace("px", ""),
                    right: marginSrc.marginRight.replace("px", ""),
                    top: marginSrc.marginTop.replace("px", ""),
                },
                padding: {
                    bottom: paddingSrc.paddingBottom.replace("px", ""),
                    left: paddingSrc.paddingLeft.replace("px", ""),
                    right: paddingSrc.paddingRight.replace("px", ""),
                    top: paddingSrc.paddingTop.replace("px", ""),
                },
            },
            message: element.querySelector(".pagebuilder-poster-content div").innerHTML,
            min_height: element.querySelector(".pagebuilder-poster-overlay").style.minHeight.split("px")[0],
            mobile_image: bgMobileImage ? decodeUrl(bgMobileImage) : "",
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
