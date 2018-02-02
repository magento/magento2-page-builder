/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Colors from "../../../../../utils/colors";
import extractAlphaFromRgba from "../../../../../utils/extractAlphaFromRgba";
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
        let mobile = "";
        const target = element.querySelector("a").getAttribute("target");
        const bgImage = element.querySelector(".pagebuilder-mobile-hidden").style.backgroundImage;
        const bgMobileImageEl = element.querySelector(".pagebuilder-mobile-only");
        if (bgMobileImageEl !== undefined
            && bgMobileImageEl.style.backgroundImage !== ""
            && bgImage !== bgMobileImageEl.style.backgroundImage
        ) {
            mobile = decodeUrl(bgMobileImageEl.style.backgroundImage);
        }
        const advancedData = this.defaultReader.read(element.querySelector(".pagebuilder-mobile-only"));
        const overlayColor = element.querySelector(".pagebuilder-overlay").getAttribute("data-background-color");
        const response: DataObject = {
            background_image: decodeUrl(bgImage),
            background_size: element.style.backgroundSize,
            button_text: element.dataset.buttonText,
            link_url: element.querySelector("a").getAttribute("href"),
            message: element.querySelector(".pagebuilder-collage-content div").innerHTML,
            minimum_height: parseInt(element.querySelector(".pagebuilder-overlay").style.minHeight, 10),
            mobile_image: mobile,
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
