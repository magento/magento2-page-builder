/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Colors from "../../../../../utils/colors";
import extractAlphaFromRgba from "../../../../../utils/extract-alpha-from-rgba";
import {decodeUrl} from "../../../../../utils/image";
import {DataObject} from "../../../../data-store";
import {ReadInterface} from "../../../read-interface";
import Default from "../../default";

export default class Collage implements ReadInterface {
    private defaultReader: Default = new Default();

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
        if (backgroundMobileImageElement !== undefined
            && backgroundMobileImageElement.style.backgroundImage !== ""
            && backgroundImage !== backgroundMobileImageElement.style.backgroundImage
        ) {
            mobileImage = decodeUrl(backgroundMobileImageElement.style.backgroundImage);
        }
        const advancedData = this.defaultReader.read(element.querySelector(".pagebuilder-mobile-only"));
        const overlayColor = element.querySelector(".pagebuilder-overlay").getAttribute("data-background-color");
        const response: DataObject = {
            background_image: decodeUrl(backgroundImage),
            background_size: element.style.backgroundSize,
            button_text: element.dataset.buttonText,
            link_url: element.querySelector("a").getAttribute("href"),
            message: element.querySelector(".pagebuilder-collage-content div").innerHTML,
            minimum_height: parseInt(element.querySelector(".pagebuilder-overlay").style.minHeight, 10),
            mobile_image: mobileImage,
            open_in_new_tab: target && target === "_blank" ? "1" : "0",
            overlay_color: this.getOverlayColor(overlayColor),
            overlay_transparency: this.getOverlayTransparency(overlayColor),
            show_button: element.getAttribute("data-show-button"),
            show_overlay: element.getAttribute("data-show-overlay"),
        };
        return new Promise((resolve: (object: object) => void) => {
            advancedData.then((data) => {
                delete data.css_classes;
                resolve(
                    Object.assign(data, response),
                );
            });
       });
    }

    /**
     * Get overlay color
     *
     * @returns string
     */
    private getOverlayColor(value: string) {
        return value === "transparent" ? "" : Colors.toHex(value);
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
