/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import Config from "../config";
import _ from 'underscore';
'use strict';

export default class Image extends Block {

    /**
     * Retrieve the image URL with directive
     *
     * @param {{}} image
     * @returns {string}
     */
    private getImageUrl(image: {}) {
        let imageUrl = image[0]['url'],
            mediaUrl = Config.getInitConfig('media_url'),
            mediaPath = imageUrl.split(mediaUrl),
            directive = '{{media url=' + mediaPath[1] + '}}';
        return directive;
    }

    /**
     * Get the desktop (main) image attributes for the render
     *
     * @returns {any}
     */
    getMainImageAttributes() {
        let data = this.getData();
        if (data.image == "" || data.image == undefined) {
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
    getMobileImageAttributes() {
        let data = this.getData();
        if (data.mobile_image == "" || data.mobile_image == undefined) {
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
    getImageAttributes() {
        let data = this.getData();
        if (data.image == "" || data.image == undefined) {
            return {};
        } else if (_.isEmpty(data.image[0])) {
            return;
        }
        return {href: this.getImageUrl(data.image), title: data.title_tag, class: (data.lightbox == "Yes" ? "bluefoot-lightbox" : "") };
    }

    /**
     * Retrieve the caption for the image
     *
     * @returns {any}
     */
    getCaption(): string {
        let data = this.getData();
        return (data.show_caption == "Yes" ? data.title_tag as string : "");
    }
}
