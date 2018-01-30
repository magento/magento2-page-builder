/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import Conversion from "../../../utils/conversion";
import PreviewBlock from "./block";

export default class Banner extends PreviewBlock {

    public showOverlayHover: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * Get the banner wrapper attributes for the preview
     *
     * @returns {any}
     */
    public getPreviewBannerAttributes() {
        let backgroundImage: string = "none";
        if (this.data.image() !== "" && this.data.image() !== undefined && this.data.image()[0] !== undefined) {
            backgroundImage = "url(" + this.data.image()[0].url + ")";
        }
        return {
            style:
            "background-image: " + backgroundImage + "; " +
            "background-size: " + this.data.background_size() + ";" +
            "min-height: " + this.data.minimum_height() + "px; ",
        };
    }

    /**
     * Get the banner overlay attributes for the preview
     *
     * @returns {any}
     */
    public getPreviewOverlayAttributes() {
        let backgroundColor: string = "transparent";
        if (this.data.show_overlay() === "always" || this.showOverlayHover()) {
            if (this.data.overlay_color() !== "" && this.data.overlay_color() !== undefined) {
                const colors = this.data.overlay_color();
                const alpha = Conversion.convertPercentToDecimal(this.data.overlay_transparency());
                backgroundColor = Conversion.colorConverter(colors, alpha);
            } else {
                backgroundColor = "transparent";
            }
        }
        return {style: "min-height: " + this.data.minimum_height() + "px; background-color: " + backgroundColor + ";"};
    }

    /**
     * Is there content in the WYSIWYG?
     *
     * @returns {boolean}
     */
    public isBannerEmpty(): boolean {
        return this.data.message() === "" || this.data.message() === undefined;
    }

    /**
     * Get the banner content attributes for the preview
     *
     * @returns {any}
     */
    public getPreviewContentAttributes() {
        if (this.data.margins_and_padding() !== "" && this.data.margins_and_padding() !== undefined) {
            const marginTop = this.data.margins_and_padding().margin.top || "0";
            const marginRight = this.data.margins_and_padding().margin.right || "0";
            const marginBottom = this.data.margins_and_padding().margin.bottom || "0";
            const marginLeft = this.data.margins_and_padding().margin.left || "0";
            const paddingTop = this.data.margins_and_padding().padding.top || "0";
            const paddingRight = this.data.margins_and_padding().padding.right || "0";
            const paddingBottom = this.data.margins_and_padding().padding.bottom || "0";
            const paddingLeft = this.data.margins_and_padding().padding.left || "0";
            return {
                style:
                    "margin-top: " + marginTop + "px; " +
                    "margin-right: " + marginRight + "px; " +
                    "margin-bottom: " + marginBottom + "px; " +
                    "margin-left: " + marginLeft + "px; " +
                    "padding-top: " + paddingTop + "px; " +
                    "padding-right: " + paddingRight + "px; " +
                    "padding-bottom: " + paddingBottom + "px; " +
                    "padding-left: " + paddingLeft + "px;",
            };
        }
    }

    /**
     * Get the content for the preview
     *
     * @returns {any}
     */
    public getContentHtml() {
        if (this.data.message() === "" || this.data.message() === undefined) {
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
    public getButtonText() {
        if (this.data.button_text() === "" || this.data.button_text() === undefined) {
            return $t("Edit Button Text");
        } else {
            return this.data.button_text();
        }
    }

    /**
     * Set state based on overlay mouseover event for the preview
     */
    public mouseoverBanner() {
        if (this.preview.data.show_overlay() === "on_hover") {
            this.preview.showOverlayHover(true);
        }
    }

    /**
     * Set state based on overlay mouseout event for the preview
     */
    public mouseoutBanner() {
        if (this.preview.data.show_overlay() === "on_hover") {
            this.preview.showOverlayHover(false);
        }
    }
}
