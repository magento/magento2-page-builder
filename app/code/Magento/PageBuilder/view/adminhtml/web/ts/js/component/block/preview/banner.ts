/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Block from "../block";
import PreviewBlock from "./block";

export default class Banner extends PreviewBlock {
    constructor(parent: Block, config: object) {
        super(parent, config);
    }

    private afterContent(styles: {}) {
        // Extract data values our of observable functions
        // The style attribute mapper converts images to directives, override it to include the correct URL
        if (this.data.background_image && typeof this.data.background_image()[0] === "object") {
            styles.backgroundImage = "url(" + this.data.background_image()[0].url + ")";
        }
        if (typeof this.data.mobile_image === "function"
            && this.data.mobile_image() !== ""
            && this.data.mobile_image()
            && typeof this.data.mobile_image()[0] === "object"
        ) {
            styles.mobileImage = "url(" + this.data.mobile_image()[0].url + ")";
        }
        return styles;
    }
}


