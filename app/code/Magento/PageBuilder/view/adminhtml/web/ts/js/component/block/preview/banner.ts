/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import Colors from "../../../utils/colors";
import Numbers from "../../../utils/numbers";
import StyleAttributeMapper from "../../format/style-attribute-mapper";
import PreviewBlock from "./block";

export default class Banner extends PreviewBlock {
    public showOverlayHover: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * Get the banner wrapper attributes for the preview
     *
     * @returns {any}
     */
    public getBackgroundAttributes() {
        let backgroundImage: string = "none";
        if (this.data.background_image && this.data.background_image() !== "" &&
            this.data.background_image() !== undefined &&
            this.data.background_image()[0] !== undefined) {
            backgroundImage = "url(" + this.data.background_image()[0].url + ")";
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
    public getOverlayAttributes() {
        let backgroundColor: string = "transparent";
        if (this.data.show_overlay() === "always" || this.showOverlayHover()) {
            if (this.data.overlay_color() !== "" && this.data.overlay_color() !== undefined) {
                const colors = this.data.overlay_color();
                const alpha = Numbers.convertPercentToDecimal(this.data.overlay_transparency());
                backgroundColor = Colors.colorConverter(colors, alpha);
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
    public isContentEmpty(): boolean {
        return this.data.message() === "" || this.data.message() === undefined;
    }

    /**
     * Get the banner content attributes for the preview
     *
     * @returns {any}
     */
    public getContentAttributes() {
        const styleMapper = new StyleAttributeMapper();
        const toDomPadding = styleMapper.toDom(this.data.margins_and_padding().padding);
        return {
            style:
                "padding-top: " + toDomPadding.top + "px; " +
                "padding-right: " + toDomPadding.right + "px; " +
                "padding-bottom: " + toDomPadding.bottom + "px; " +
                "padding-left: " + toDomPadding.left + "px;",
        };
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
    public onMouseOver() {
        if (this.preview.data.show_overlay() === "on_hover") {
            this.preview.showOverlayHover(true);
        }
    }

    /**
     * Set state based on overlay mouseout event for the preview
     */
    public onMouseOut() {
        if (this.preview.data.show_overlay() === "on_hover") {
            this.preview.showOverlayHover(false);
        }
    }

    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */
    private afterStyleMapped(styles: {}) {
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
