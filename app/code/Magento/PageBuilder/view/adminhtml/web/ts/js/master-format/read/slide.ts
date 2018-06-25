/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Link from "../../property/link";
import {toHex} from "../../utils/color-converter";
import extractAlphaFromRgba from "../../utils/extract-alpha-from-rgba";
import {decodeUrl} from "../../utils/image";
import {ReadInterface} from "../read-interface";
import Default from "./default";

/**
 * @api
 */
export default class Slide implements ReadInterface {
    private defaultReader: Default = new Default();
    private linkConverter: Link = new Link();

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<object> {
        let bgMobileImage = element.querySelectorAll(".pagebuilder-slide-wrapper")[0].style.backgroundImage;
        const slideName = element.getAttribute("data-slide-name");
        const linkUrl = element.querySelector("a");
        const bgImage = element.querySelectorAll(".pagebuilder-slide-wrapper")[1].style.backgroundImage;
        const overlayColor = element.querySelector(".pagebuilder-poster-overlay").getAttribute("data-overlay-color");
        const paddingSrc = element.querySelector(".pagebuilder-poster-overlay").style;
        const marginSrc = element.style;
        if (bgImage === bgMobileImage) {
            bgMobileImage = false;
        }
        const button = element.querySelector("button");
        const buttonText = button ? button.textContent : "";
        const buttonType = button ? button.classList[1] : "pagebuilder-button-primary";
        const response: any = {
            slide_name: slideName ? slideName : "",
            background_image: decodeUrl(bgImage),
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
            content: element.querySelector(".pagebuilder-poster-content div").innerHTML,
            min_height: element.querySelector(".pagebuilder-poster-overlay").style.minHeight.split("px")[0],
            mobile_image: bgMobileImage ? decodeUrl(bgMobileImage) : "",
            overlay_color: this.getOverlayColor(overlayColor),
            overlay_transparency: this.getOverlayTransparency(overlayColor),
            show_button: element.getAttribute("data-show-button"),
            show_overlay: element.getAttribute("data-show-overlay"),
            text_align: element.querySelector(".pagebuilder-slide-wrapper").style.textAlign,
        };

        const slideAttributeElement = element.querySelector("div");
        const slideAttributesPromise = this.defaultReader.read(slideAttributeElement);

        return slideAttributesPromise.then((slideAttributes) => {
            delete slideAttributes.css_classes;
            return Promise.resolve(Object.assign(slideAttributes, response));
        });
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
