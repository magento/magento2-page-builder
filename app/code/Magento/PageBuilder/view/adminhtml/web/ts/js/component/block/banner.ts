/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import {fromHex} from "../../utils/color-converter";
import {getImageUrl} from "../../utils/directives";
import {percentToDecimal} from "../../utils/number-converter";
import StyleAttributeMapper from "../format/style-attribute-mapper";
import Block from "./block";

export default class Banner extends Block {

    /**
     * Get the banner wrapper attributes for the storefront
     *
     * @returns {any}
     */
    public getBannerAttributes(type: string) {
        const data = this.getData();
        let backgroundImage: string = "";
        if (type === "image") {
            backgroundImage = this.getImage() ? "url(" + this.getImage() + ")" : "none";
        } else if (type === "mobileImage") {
            backgroundImage = this.getMobileImage() ? "url(" + this.getMobileImage() + ")" : "none";
        }
        return {
            style:
                "background-image: " + backgroundImage + "; " +
                "min-height: " + data.minimum_height + "px; " +
                "background-size: " + data.background_size + ";",
        };
    }

    /**
     * Get the banner overlay attributes for the storefront
     *
     * @returns {any}
     */
    public getOverlayAttributes() {
        const data = this.getData();
        let bgColorAttr: string = "transparent";
        let bgColor: string = "transparent";
        if (data.show_overlay !== "never_show") {
            if (data.overlay_color !== "" && data.overlay_color !== undefined) {
                bgColorAttr = fromHex(
                    data.overlay_color,
                    percentToDecimal(data.overlay_transparency),
                );
            } else {
                bgColorAttr = "transparent";
            }
        }
        if (data.show_overlay === "never_show" || data.show_overlay === "on_hover") {
            bgColor = "transparent";
        } else {
            if (data.overlay_color !== "" && data.overlay_color !== undefined) {
                bgColor = fromHex(
                    data.overlay_color,
                    percentToDecimal(data.overlay_transparency),
                );
            } else {
                bgColor = "transparent";
            }
        }
        return {
            "data-background-color" : bgColorAttr,
            "style": "min-height: " + data.minimum_height + "px; background-color: " + bgColor + ";",
        };
    }

    /**
     * Get the banner content attributes for the storefront
     *
     * @returns {any}
     */
    public getContentAttributes() {
        const styleMapper = new StyleAttributeMapper();
        const toDomPadding = styleMapper.toDom(this.getData().fields.margins_and_padding.default.padding);
        return {
            style:
                "padding-top: " + toDomPadding.top + "px; " +
                "padding-right: " + toDomPadding.right + "px; " +
                "padding-bottom: " + toDomPadding.bottom + "px; " +
                "padding-left: " + toDomPadding.left + "px;",
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
        if (data.image === "" || data.image === undefined) {
            return {};
        }
        if (_.isEmpty(data.image[0])) {
            return;
        }
        return getImageUrl(data.image);
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
        return getImageUrl(data.mobile_image);
    }
}
