/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import Config from "../config";
import _ from 'underscore';
'use strict';
/*eslint-disable */
export default class Driver extends Block {

    /**
     * Retrieve the image URL with directive
     *
     * @param {Array} image
     * @returns {string}
     */
    private getImageUrl(image: []){
        let imageUrl = image[0]['url'],
            mediaUrl = Config.getInitConfig('media_url'),
            mediaPath = imageUrl.split(mediaUrl),
            directive = '{{media url=' + mediaPath[1] + '}}';
        return directive;
    }

    /**
     * Does the driver have a mobile image?
     *
     * @returns {boolean}
     */
    hasMobileImage() {
        let data = this.getData();
        return !(data.mobile_image == "" || data.mobile_image == undefined || _.isEmpty(data.mobile_image[0]));
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
    getMobileImageAttributes() {
        let data = this.getData();
        if (data.mobile_image == "" || data.mobile_image == undefined) {
            return {};
        }
        if (_.isEmpty(data.mobile_image[0])) {
            return;
        }
        return {src: this.getImageUrl(data.mobile_image), alt: data.alt, title: data.title_tag };
    }
}
