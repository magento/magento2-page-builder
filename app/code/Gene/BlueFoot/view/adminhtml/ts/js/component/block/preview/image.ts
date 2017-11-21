/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";

export default class Image extends PreviewBlock {

    getPreviewImageAttributes() {
        if (this.data.image() == "" || this.data.image() == undefined) {
            return {style: "visibility: hidden"};
        }
        return {src: this.data.image()[0].url, style: "visibility: visible; width: 20%"};
    }

    getPreviewIconAttributes() {
        if (this.data.image() == "" || this.data.image() == undefined) {
            return {class: "icon-bluefoot-image", style: "visibility: visible"};
        }
        return {style: "visibility: hidden"};
    }
}
