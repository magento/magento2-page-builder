/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import Config from "../config";
import Block from "./block";

export default class Image extends Block {

    /**
     * Get the desktop (main) image attributes for the render
     *
     * @returns {any}
     */
    public getMainImageAttributes() {
        const data = this.getData();
        if (data.image === "" || data.image === undefined) {
            return {};
        } else if (_.isEmpty(data.image[0])) {
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
        } else if (_.isEmpty(data.mobile_image[0])) {
            return;
        }
        return {src: this.getImageUrl(data.mobile_image), alt: data.alt, title: data.title_tag };
    }

    /**
     * Retrieve the image attributes
     *
     * @returns {any}
     */
    public getImageAttributes() {
        const data = this.getData();
        if (data.image === "" || data.image === undefined) {
            return {};
        } else if (_.isEmpty(data.image[0])) {
            return;
        }
        return {
            class: (data.lightbox === "Yes" ? "bluefoot-lightbox" : ""),
            href: this.getImageUrl(data.image),
            title: data.title_tag,
        };
    }

    /**
     * Retrieve the caption for the image
     *
     * @returns {any}
     */
    public getCaption(): string {
        const data = this.getData();
        return (data.show_caption === "Yes" ? data.title_tag as string : "");
    }

    /**
     * Retrieve the image URL with directive
     *
     * @param {{}} image
     * @returns {string}
     */
    private getImageUrl(image: any[]) {
        const url = "url";
        const imageUrl = image[0][url];
        const mediaUrl = Config.getInitConfig("mediaUrl");
        const mediaPath = imageUrl.split(mediaUrl);
        const directive = "{{media url=" + mediaPath[1] + "}}";
        return directive;
    }

}
