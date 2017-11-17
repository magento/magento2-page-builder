/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import Config from "../config";
import {toDataUrl} from "../../utils/directives";

export default class Image extends Block {

    getImageUrl(image: {}) {
        let imageUrl = image[0]['url'],
            mediaUrl = Config.getInitConfig('media_url'),
            mediaPath = imageUrl.split(mediaUrl),
            directive = '{{media url=' + mediaPath[1] + '}}';
        return toDataUrl(directive);
    }

    getImage1Attributes() {
        let data = this.getData();
        if (data.image == "" || data.image == undefined) {
            return {};
        }
        return {src: this.getImageUrl(data.image), alt: data.alt, title: data.title_tag };
    }

    getImage2Attributes() {
        let data = this.getData();
        if (data.mobile_image == "" || data.mobile_image == undefined) {
            return {};
        }
        return {src: this.getImageUrl(data.mobile_image), alt: data.alt, title: data.title_tag };
    }

    getImageAttributes() {
        let data = this.getData();
        if (data.image == "" || data.image == undefined) {
            return {};
        }
        return {href: this.getImageUrl(data.image), title: data.title_tag, class: (data.lightbox == "Yes" ? "bluefoot-lightbox" : "") };
    }

    hasMobileImage() {
        let data = this.getData();
        return (data.mobile_image == "" || data.mobile_image == undefined);
    }

    getCaption() {
        let data = this.getData();
        if (data.show_caption == "YES") {
            return "HELLO";
        } else {
            return "";
        }
    }
}