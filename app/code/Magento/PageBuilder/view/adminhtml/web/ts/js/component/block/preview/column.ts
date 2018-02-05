/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {StyleAttributeMapperResult} from "../../format/style-attribute-mapper";
import PreviewBlock from "./block";

export default class Column extends PreviewBlock {
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
        return styles;
    }
}
