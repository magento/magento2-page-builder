/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import "tabs";
import {fromHex} from "../../../utils/color-converter";
import PreviewBlock from "./block";

export default class Tab extends PreviewBlock {
    /**
     * Get the Tab style attributes for the preview
     *
     * @returns {any}
     */
    public getTabStyles() {
        let backgroundImage: string = "none";
        if (this.data.background_image && this.data.background_image() !== "" &&
            this.data.background_image() !== undefined &&
            this.data.background_image()[0] !== undefined) {
            backgroundImage = "url(" + this.data.background_image()[0].url + ")";
        }
        let backgroundColor = "transparent";
        if (this.data.background_color() !== "") {
            backgroundColor = fromHex(this.data.background_color(), "1");
        }
        const marginsPadding = typeof this.data.margins_and_padding() === "string" ?
            JSON.parse(this.data.margins_and_padding()) :
            this.data.margins_and_padding();
        const paddingTop = marginsPadding.padding.top || "0";
        const paddingRight = marginsPadding.padding.right || "0";
        const paddingBottom = marginsPadding.padding.bottom || "0";
        const paddingLeft = marginsPadding.padding.left || "0";
        return {
            paddingBottom: paddingBottom + "px",
            paddingLeft: paddingLeft + "px",
            paddingRight: paddingRight + "px",
            paddingTop: paddingTop + "px",
            backgroundImage,
            backgroundColor,
            backgroundSize: this.data.background_size(),
            border: this.data.border(),
        };
    }
}
