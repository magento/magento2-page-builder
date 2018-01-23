/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import _ from "underscore";
import $t from "mage/translate";
import Config from "../config";
import Block from "./block";

export default class Banner extends Block {

    private detailsEnabled: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * Get the banner wrapper attributes for the storefront
     *
     * @returns {any}
     */
    public getBannerAttributes() {
        const data = this.getData();
        let backgroundImage:string = this.getImage() ? "url(" + this.getImage() + ")" : "none";
        return {style: "background-image: " + backgroundImage + "; min-height: " + data.minimum_height + "px; background-size: " + data.background_size + ";"};
    }

    /**
     * Get the banner overlay attributes for the storefront
     *
     * @returns {any}
     */
    public getOverlayAttributes() {
        const data = this.getData();
        let backgroundColor:string = data.show_overlay === "never_show" ? "transparent" : this.convertHexToRgba();
        return {style: "min-height: " + data.minimum_height + "px; background-color: " + backgroundColor + ";"};
    }

    /**
     * Convert HEX to RGBA for transparent overlay for the preview
     *
     * @returns {string}
     */
    private convertHexToRgba() {
        const data = this.getData();
        if (data.overlay_color !== "" && data.overlay_color !== undefined) {
            let colors = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.overlay_color),
                red = parseInt(colors[1], 16),
                green = parseInt(colors[2], 16),
                blue = parseInt(colors[3], 16),
                alpha = this.convertPercentToDecimal(data.overlay_transparency);
            return "rgba(" + red + "," + green +"," + blue + "," + alpha + ")";
        } else {
            return "transparent";
        }
    }

    /**
     * Convert percent to decimal for transparent overlay for the preview
     *
     * @param {string} value
     * @returns {string}
     */
    private convertPercentToDecimal(value: string) {
        return (parseInt(value, 10) / 100).toString();
    }

    /**
     * Get the banner content attributes for the storefront
     *
     * @returns {any}
     */
    public getContentAttributes() {
        const data = this.getData();
        const marginTop = data.fields.margins_and_padding.default.margin.top || "0",
              marginRight = data.fields.margins_and_padding.default.margin.right || "0",
              marginBottom = data.fields.margins_and_padding.default.margin.bottom || "0",
              marginLeft = data.fields.margins_and_padding.default.margin.left || "0",
              paddingTop = data.fields.margins_and_padding.default.padding.top || "0",
              paddingRight = data.fields.margins_and_padding.default.padding.right || "0",
              paddingBottom = data.fields.margins_and_padding.default.padding.bottom || "0",
              paddingLeft = data.fields.margins_and_padding.default.padding.left || "0";
        return {
            style:
            "margin-top: " + marginTop + "px; " +
            "margin-right: " + marginRight + "px; " +
            "margin-bottom: " + marginBottom + "px; " +
            "margin-left: " + marginLeft + "px; " +
            "padding-top: " + paddingTop + "px; " +
            "padding-right: " + paddingRight + "px; " +
            "padding-bottom: " + paddingBottom + "px; " +
            "padding-left: " + paddingLeft + "px;"
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
        return this.getImageUrl(data.image);
    }

    /**
     * Show banner details
     *
     * @returns {any}
     */
    public enableDetails() {
        this.detailsEnabled(true);
    }

    /**
     * Hide banner details
     *
     * @returns {any}
     */
    public disableDetails() {
        this.detailsEnabled(false);
    }

    /**
     * Does the banner have a mobile image?
     *
     * @returns {boolean}
     */
    public hasMobileImage() {
        const data = this.getData();
        return !(data.mobile_image === "" || data.mobile_image === undefined || _.isEmpty(data.mobile_image[0]));
    }

    /**
     * Get the desktop (main) image attributes for the render
     *
     * @returns {any}
     */
    public getMainImageAttributes() {
        const data = this.getData();
        if (data.image === "" || data.image === undefined) {
            return {};
        }
        if (_.isEmpty(data.image[0])) {
            return;
        }
        return {src: this.getImageUrl(data.image), alt: data.alt, title: data.title_tag };
    }

    /**
     * Get the mobile image attributes for the render
     *
     * @returns {any}
     */
    public getMobileImageAttributes() {
        const data = this.getData();
        if (data.mobile_image === "" || data.mobile_image === undefined) {
            return {};
        }
        if (_.isEmpty(data.mobile_image[0])) {
            return;
        }
        return {src: this.getImageUrl(data.mobile_image), alt: data.alt, title: data.title_tag };
    }

    /**
     * Retrieve the image URL with directive
     *
     * @param {Array} image
     * @returns {string}
     */
    private getImageUrl(image: any[]) {
        const imageUrl = image[0].url;
        const mediaUrl = Config.getInitConfig("media_url");
        const mediaPath = imageUrl.split(mediaUrl);
        const directive = "{{media url=" + mediaPath[1] + "}}";
        return directive;
    }
}
