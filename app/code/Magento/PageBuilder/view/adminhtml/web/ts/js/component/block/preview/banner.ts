/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";

export default class Banner extends PreviewBlock {

    /**
     * Retrieve the banner attributes for the preview
     *
     * @returns {any}
     */
    public getOverlayAttributes() {
        if (this.data.show_overlay() === "never_show") {
            return;
        } else if (this.data.show_overlay() === "always") {
            if (this.data.overlay_color() != undefined && this.data.overlay_transparency()) {
                return {style: "background-color: " + this.data.overlay_color() + "; opacity: " + this.data.overlay_transparency() / 100}
            }
        }
    }

    public getButtonText() {
        if (this.data.button_text() === undefined) {
            return "Edit Button Text"
        } else {
            return this.data.button_text();
        }
    }
}
