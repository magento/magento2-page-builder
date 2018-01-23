/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import Config from "../config";
import Block from "./block";

export default class Banner extends Block {

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
        let backgroundColor:string = data.show_overlay === "never_show" ? "transparent" : "transparent";
        return {style: "min-height: " + data.minimum_height + "px; background-color: " + backgroundColor + ";"};
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
