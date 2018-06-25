/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Link from "../../../../property/link";
import {toHex} from "../../../../utils/color-converter";
import extractAlphaFromRgba from "../../../../utils/extract-alpha-from-rgba";
import {decodeUrl} from "../../../../utils/image";
import {ReadInterface} from "../../../read-interface";

/**
 * @api
 */
export default class Collage implements ReadInterface {
    private linkConverter: Link = new Link();

    /**
     * Read background from the element
     * Reuse default reader logic to point at mobile version
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<object> {
        let mobileImage = "";
        const target = element.querySelector("a").getAttribute("target");
        const backgroundImage = element.querySelector(".pagebuilder-mobile-hidden").style.backgroundImage;
        const backgroundMobileImageElement = element.querySelector(".pagebuilder-mobile-only");
        const linkUrl = element.querySelector("a");
        if (backgroundMobileImageElement !== undefined
            && backgroundMobileImageElement.style.backgroundImage !== ""
            && backgroundImage !== backgroundMobileImageElement.style.backgroundImage
        ) {
            mobileImage = decodeUrl(backgroundMobileImageElement.style.backgroundImage);
        }
        const overlayColor = element.querySelector(".pagebuilder-overlay").getAttribute("data-overlay-color");
        const paddingSrc = element.querySelector(".pagebuilder-mobile-only").style;
        const marginSrc = element.style;
        const button = element.querySelector("button");
        const buttonText = button ? button.textContent : "";
        const buttonType = button ? button.classList[1] : "pagebuilder-button-primary";
        const response: any = {
            background_image: decodeUrl(backgroundImage),
            background_size: element.style.backgroundSize,
            button_text: buttonText,
            button_type: buttonType,
            link_url: this.linkConverter.read(linkUrl),
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
            content: element.querySelector(".pagebuilder-collage-content div").innerHTML,
            min_height: element.querySelector(".pagebuilder-slide-wrapper").style.minHeight ?
                parseInt(element.querySelector(".pagebuilder-slide-wrapper").style.minHeight, 10) : 0,
            mobile_image: mobileImage,
            open_in_new_tab: target && target === "_blank" ? "1" : "0",
            overlay_color: this.getOverlayColor(overlayColor),
            overlay_transparency: this.getOverlayTransparency(overlayColor),
            show_button: element.getAttribute("data-show-button"),
            show_overlay: element.getAttribute("data-show-overlay"),
            text_align: element.querySelector(".pagebuilder-slide-wrapper").style.textAlign,
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
