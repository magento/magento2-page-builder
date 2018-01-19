/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";

export default class Banner extends PreviewBlock {

    /**
     * Get the banner overlay attributes for the preview
     *
     * @returns {any}
     */
    public getPreviewBannerAttributes() {
        let backgroundImage = "none",
            minHeight = "250px",
            backgroundSize = "cover";

        if (this.data.image() !== "" && this.data.image() !== undefined && this.data.image()[0] !== undefined) {
            backgroundImage = "url(" + this.data.image()[0].url + ")";
        }
        return {style: "background-image: " + backgroundImage + "; min-height: " + minHeight + "; background-size: " + backgroundSize + ";"};
    }

    /**
     * Get the banner overlay attributes for the preview
     *
     * @returns {any}
     */
    public getPreviewOverlayAttributes() {
        let backgroundColor = this.data.show_overlay() === "never_show" ? "transparent" : "rgba(0,0,0,0.3)";
        return {style: "min-height: 250px; background-color: " + backgroundColor + ";"};
    }

    /**
     * Is there content in the WYSIWYG?
     *
     * @returns {boolean}
     */
    public isBannerEmpty() {
        return this.data.message() === "" || this.data.message() === undefined ? true : false;
    }

    /**
     * Get the content for the preview
     *
     * @returns {any}
     */
    public getContentHtml() {
        if (this.data.message() === "" || this.data.message() === undefined) {
            return "Write banner text here...";
        } else {
            return this.data.message();
        }
    }

    /**
     * Get the button text for the preview
     *
     * @returns {any}
     */
    public getButtonText() {
        if (this.data.button_text() === "" || this.data.button_text() === undefined) {
            return "Edit Button Text";
        } else {
            return this.data.button_text();
        }
    }
}
