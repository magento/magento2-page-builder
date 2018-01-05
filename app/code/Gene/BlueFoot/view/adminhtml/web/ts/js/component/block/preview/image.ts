/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";
'use strict';

export default class Image extends PreviewBlock {

    /**
     * Retrieve the image attributes for the preview
     *
     * @returns {any}
     */
    getPreviewImageAttributes() {
        if (this.data.image() == "" || this.data.image() == undefined) {
            return {style: "visibility: hidden"};
        }
        return {src: this.data.image()[0].url, style: "visibility: visible; width: 20%"};
    }

    /**
     * Get the preview icon attributes
     *
     * @returns {any}
     */
    getPreviewIconAttributes() {
        if (this.data.image() == "" || this.data.image() == undefined) {
            return {class: "icon-bluefoot-image", style: "visibility: visible"};
        }
        return {style: "visibility: hidden"};
    }
}
