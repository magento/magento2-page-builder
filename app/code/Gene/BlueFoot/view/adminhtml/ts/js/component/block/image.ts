/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import Config from "../config";
import _ from 'underscore';

export default class Image extends Block {

    private getImageUrl(image: {}) {
        let imageUrl = image[0]['url'],
            mediaUrl = Config.getInitConfig('media_url'),
            mediaPath = imageUrl.split(mediaUrl),
            directive = '{{media url=' + mediaPath[1] + '}}';
        return directive;
    }

    getMainImageAttributes() {
        let data = this.getData();
        if (data.image == "" || data.image == undefined) {
            return {};
        } else if (_.isEmpty(data.image[0])) {
            return;
        }
        return {src: this.getImageUrl(data.image), alt: data.alt, title: data.title_tag };
    }

    getMobileImageAttributes() {
        let data = this.getData();
        if (data.mobile_image == "" || data.mobile_image == undefined) {
            return {};
        } else if (_.isEmpty(data.mobile_image[0])) {
            return;
        }
        return {src: this.getImageUrl(data.mobile_image), alt: data.alt, title: data.title_tag };
    }

    getImageAttributes() {
        let data = this.getData();
        if (data.image == "" || data.image == undefined) {
            return {};
        } else if (_.isEmpty(data.image[0])) {
            return;
        }
        return {href: this.getImageUrl(data.image), title: data.title_tag, class: (data.lightbox == "Yes" ? "bluefoot-lightbox" : "") };
    }

    getCaption() {
        let data = this.getData();
        if (data.show_caption == "Yes") {
            return data.title_tag;
        } else {
            return "";
        }
    }
}
