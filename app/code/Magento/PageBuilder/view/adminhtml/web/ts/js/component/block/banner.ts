/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import {fromHex} from "../../utils/color-converter";
import {getImageUrl} from "../../utils/directives";
import {percentToDecimal} from "../../utils/number-converter";
import Block from "./block";

export default class Banner extends Block {

    /**
     * Get the banner wrapper styles for the storefront
     *
     * @returns {object}
     */
    public getBannerStyles(type: string): {} {
        const data = this.getData();
        let backgroundImage: any = "";
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
     * @returns {object}
     */
    public getOverlayAttributes(): {} {
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
     * @returns {object}
     */
    public getOverlayStyles(): {} {
        const data = this.getData();
        const { top = 0, right = 0, bottom = 0, left = 0 } = data.margins_and_padding.padding;
        return {
            backgroundColor: this.getOverlayColorStyle().backgroundColor,
            minHeight: data.min_height + "px",
            paddingBottom: bottom + "px",
            paddingLeft: left + "px",
            paddingRight: right + "px",
            paddingTop: top + "px",
        };
    }

    /**
     * Get the overlay color style only for the storefront
     *
     * @returns {object}
     */
    public getOverlayColorStyle(): {} {
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
     * @returns {string}
     */
    public getContentHtml(): string {
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
     * @returns {object}
     */
    public getImage(): {} {
        const data = this.getData();
        if (data.background_image === "" || data.background_image === undefined) {
            return {};
        }
        if (_.isEmpty(data.background_image[0])) {
            return;
        }
        return getImageUrl(data.background_image);
    }

    /**
     * Get the mobile image attributes for the render
     *
     * @returns {object}
     */
    public getMobileImage(): {} {
        const data = this.getData();
        if (data.mobile_image === "" || data.mobile_image === undefined) {
            return {};
        }
        if (_.isEmpty(data.mobile_image[0])) {
            return;
        }
        return getImageUrl(data.mobile_image);
    }

    /**
     * Get the link attributes for the render
     *
     * @returns {object}
     */
    public getLinkAttribute(): {} {
        const data = this.getData();
        return {
            href: data.link_url,
            target: data.open_in_new_tab === "1" ? "_blank" : false ,
        };
    }

    /**
     * Get the button style for the render
     *
     * @returns {object}
     */
    public getButtonStyle(): {} {
        const data = this.getData();
        return {
            opacity: data.show_button === "always" ? "1" : "0",
            visibility: data.show_button === "always" ? "visible" : "hidden",
        };
    }

    /**
     * Get banner container style only for the storefront
     *
     * @returns {object}
     */
    public getBannerContainerStyle(): {} {
        return Object.assign(
            this.getStyle(),
            {
                backgroundImage: "",
                minHeight: "",
                padding: "",
                paddingBottom: "",
                paddingLeft: "",
                paddingRight: "",
                paddingTop: "",
                textAlign: "",
            },
        );
    }
}
