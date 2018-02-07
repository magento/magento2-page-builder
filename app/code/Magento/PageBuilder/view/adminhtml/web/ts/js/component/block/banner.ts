/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import {fromHex} from "../../utils/color-converter";
import {getImageUrl} from "../../utils/directives";
import {percentToDecimal} from "../../utils/number-converter";
import Config from "../config";
import Block from "./block";

export default class Banner extends Block {

    /**
     * Get the banner wrapper styles for the storefront
     *
     * @returns {any}
     */
    public getBannerStyles(type: string) {
        const data = this.getData();
        let backgroundImage: string = "";
        if (type === "image") {
            backgroundImage = this.getImage() ? this.getStyle().backgroundImage : "none";
        }

        if (type === "mobileImage") {
            if (this.getMobileImage()) {
                backgroundImage = this.getStyle().mobileImage;
            } else {
                if (this.getImage()) {
                    backgroundImage = this.getStyle().backgroundImage;
                } else {
                    backgroundImage = "none";
                }
            }
        }
        return {
            backgroundImage,
            backgroundSize: data.background_size,
        };
    }

    /**
     * Get the banner overlay attributes for the storefront
     *
     * @returns {any}
     */
    public getOverlayAttributes() {
        const data = this.getData();
        let overlayColorAttr: string = "transparent";
        if (data.show_overlay !== "never_show") {
            if (data.overlay_color !== "" && data.overlay_color !== undefined) {
                overlayColorAttr = fromHex(data.overlay_color, percentToDecimal(data.overlay_transparency));
            }
        }
        return {
            "data-overlay-color" : overlayColorAttr,
        };
    }

    /**
     * Get the banner overlay styles for the storefront
     *
     * @returns {any}
     */
    public getOverlayStyles() {
        const data = this.getData();
        const paddingTop = data.margins_and_padding.padding.top || "0";
        const paddingRight = data.margins_and_padding.padding.right || "0";
        const paddingBottom = data.margins_and_padding.padding.bottom || "0";
        const paddingLeft = data.margins_and_padding.padding.left || "0";
        return {
            backgroundColor: this.getOverlayColorStyle().backgroundColor,
            boxSizing: "border-box",
            minHeight: data.min_height + "px",
            paddingBottom: paddingBottom + "px",
            paddingLeft: paddingLeft + "px",
            paddingRight: paddingRight + "px",
            paddingTop: paddingTop + "px",
        };
    }

    /**
     * Get the overlay color style only for the storefront
     *
     * @returns {any}
     */
    public getOverlayColorStyle() {
        const data = this.getData();
        let overlayColor: string = "transparent";
        if (data.show_overlay === "always" && data.overlay_color !== "" && data.overlay_color !== undefined) {
            overlayColor = fromHex(data.overlay_color, percentToDecimal(data.overlay_transparency));
        }
        return {
            backgroundColor: overlayColor,
        };
    }

    /**
     * Get the banner content for the storefront
     *
     * @returns {any}
     */
    public getContentHtml() {
        const data = this.getData();
        if (data.message === "" || data.message === undefined) {
            return;
        } else {
            return $t(data.message);
        }
    }

    /**
     * Get the desktop (main) image attributes for the render
     *
     * @returns {any}
     */
    public getImage() {
        const data = this.getData();
        if (data.background_image === "" || data.background_image === undefined) {
            return {};
        }
        if (_.isEmpty(data.background_image[0])) {
            return;
        }
        return getImageUrl(data.background_image, Config.getInitConfig("media_url"));
    }

    /**
     * Get the mobile image attributes for the render
     *
     * @returns {any}
     */
    public getMobileImage() {
        const data = this.getData();
        if (data.mobile_image === "" || data.mobile_image === undefined) {
            return {};
        }
        if (_.isEmpty(data.mobile_image[0])) {
            return;
        }
        return getImageUrl(data.mobile_image, Config.getInitConfig("media_url"));
    }
}
