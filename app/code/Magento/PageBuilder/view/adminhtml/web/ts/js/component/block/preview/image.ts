/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";

export default class Image extends PreviewBlock {

    /**
     * Retrieve the image attributes for the preview
     *
     * @returns {any}
     */
    public getPreviewImageAttributes() {
        if (this.data.image() === "" || this.data.image() === undefined || this.data.image()[0] === undefined) {
            return {style: "visibility: hidden"};
        }
        return {src: this.data.image()[0].url, style: "visibility: visible; width: 20%"};
    }
}
