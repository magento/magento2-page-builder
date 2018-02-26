/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import {fromHex} from "../../../utils/color-converter";
import {percentToDecimal} from "../../../utils/number-converter";
import PreviewBlock from "./block";

export default class Banner extends PreviewBlock {
    private showOverlayHover: KnockoutObservable<boolean> = ko.observable(false);
    private showButtonHover: KnockoutObservable<boolean> =  ko.observable(false);

    /**
     * Get the banner wrapper attributes for the preview
     *
     * @returns {any}
     */
    public getBackgroundStyles() {
        let backgroundImage: string = "none";
        if (this.data.background_image && this.data.background_image() !== "" &&
            this.data.background_image() !== undefined &&
            this.data.background_image()[0] !== undefined) {
            backgroundImage = "url(" + this.data.background_image()[0].url + ")";
        }
        return {
            backgroundImage,
            backgroundSize: this.data.background_size(),
            minHeight: this.data.min_height() ? this.data.min_height() + "px" : "300px",
            paddingBottom: "",
            paddingLeft: "",
            paddingRight: "",
            paddingTop: "",
        };
    }

    /**
     * Get the banner overlay attributes for the preview
     *
     * @returns {any}
     */
    public getOverlayStyles() {
        const paddingTop = this.data.margins_and_padding().padding.top || "0";
        const paddingRight = this.data.margins_and_padding().padding.right || "0";
        const paddingBottom = this.data.margins_and_padding().padding.bottom || "0";
        const paddingLeft = this.data.margins_and_padding().padding.left || "0";
        return {
            backgroundColor: this.getOverlayColorStyle().backgroundColor,
            minHeight: this.data.min_height() ? this.data.min_height() + "px" : "300px",
            paddingBottom: paddingBottom + "px",
            paddingLeft: paddingLeft + "px",
            paddingRight: paddingRight + "px",
            paddingTop: paddingTop + "px",
        };
    }

    /**
     * Get the overlay background style for the preview
     *
     * @returns {any}
     */
    public getOverlayColorStyle() {
        let overlayColor: string = "transparent";
        if (this.data.show_overlay() === "always" || this.showOverlayHover()) {
            if (this.data.overlay_color() !== "" && this.data.overlay_color() !== undefined) {
                const colors = this.data.overlay_color();
                const alpha = percentToDecimal(this.data.overlay_transparency());
                overlayColor = fromHex(colors, alpha);
            } else {
                overlayColor = "transparent";
            }
        }
        return {
            backgroundColor: overlayColor,
        };
    }

    /**
     * Is there content in the WYSIWYG?
     *
     * @returns {boolean}
     */
    public isContentEmpty(): boolean {
        return this.data.message() === "" || this.data.message() === undefined;
    }

    /**
     * Get the content for the preview
     *
     * @returns {any}
     */
    public getContentHtml() {
        if (this.isContentEmpty()) {
            return $t("Write banner text here...");
        } else {
            return $t(this.data.message());
        }
    }

    /**
     * Get the button text for the preview
     *
     * @returns {any}
     */
    public getButtonStyles() {
        const buttonStyle = {
            opacity : "0",
            visibility : "hidden",
        };
        if (this.data.show_button() === "always" || this.showButtonHover()) {
            buttonStyle.opacity = "1";
            buttonStyle.visibility = "visible";
        }
        return buttonStyle;
    }

    /**
     * Set state based on overlay mouseover event for the preview
     */
    public onMouseOverWrapper() {
        if (this.preview.data.show_overlay() === "on_hover") {
            this.preview.showOverlayHover(true);
        }
        if (this.preview.data.show_button() === "on_hover") {
            this.preview.showButtonHover(true);
        }
    }

    /**
     * Set state based on overlay mouseout event for the preview
     */
    public onMouseOutWrapper() {
        if (this.preview.data.show_overlay() === "on_hover") {
            this.preview.showOverlayHover(false);
        }
        if (this.preview.data.show_button() === "on_hover") {
            this.preview.showButtonHover(false);
        }
    }

    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */
    protected afterStyleMapped(styles: {}) {
        // Extract data values our of observable functions
        // The style attribute mapper converts images to directives, override it to include the correct URL
        if (this.data.background_image && typeof this.data.background_image()[0] === "object") {
            styles.backgroundImage = "url(" + this.data.background_image()[0].url + ")";
        }
        if (typeof this.data.mobile_image
            && this.data.mobile_image() !== ""
            && typeof this.data.mobile_image()[0] === "object"
        ) {
            styles.mobileImage = "url(" + this.data.mobile_image()[0].url + ")";
        }
        return styles;
    }
}
