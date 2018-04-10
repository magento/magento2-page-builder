/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import {ConfigContentBlock} from "../../config";
import {StyleAttributeMapperResult} from "../../format/style-attribute-mapper";
import Block from "../block";
import PreviewBlock from "./block";
import {getMaxColumns} from "./column-group/resizing";

export default class Column extends PreviewBlock {

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);

        this.data.width.subscribe((newWidth) => {
            const maxColumns = getMaxColumns();
            newWidth = parseFloat(newWidth);
            newWidth = Math.round(newWidth / (100 / maxColumns));
            const newLabel = `${newWidth}/${maxColumns}`;
            const column = $t("Column");
            this.displayLabel(`${column} ${newLabel}`);
        });

    }

    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */
    protected afterStyleMapped(styles: StyleAttributeMapperResult) {
        // Extract data values our of observable functions
        // The style attribute mapper converts images to directives, override it to include the correct URL
        if (this.data.background_image && typeof this.data.background_image()[0] === "object") {
            styles.backgroundImage = "url(" + this.data.background_image()[0].url + ")";
        }

        // If we have left and right margins we need to minus this from the total width
        if (this.data.margins_and_padding && this.data.margins_and_padding().margin) {
            const margins = this.data.margins_and_padding().margin;
            const horizontalMargin = parseInt(margins.left || 0, 10) +
                parseInt(margins.right || 0, 10);
            styles.width = "calc(" + styles.width + " - " + horizontalMargin + "px)";
        }

        // If the right margin is 0, we set it to 1px to overlap the columns to create a single border
        if (styles.marginRight === "0px") {
            styles.marginRight = "1px";
        }

        // If the border is set to default we show no border in the admin preview, as we're unaware of the themes styles
        if (this.data.border && this.data.border() === "_default") {
            styles.border = "none";
        }

        return styles;
    }
}
