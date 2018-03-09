/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";

export default class Heading extends PreviewBlock {

    /**
     * Get the heading styles for the preview
     *
     * @returns string
     */
    public getHeadingStyles(): string {
        const data = this.data;
        let styles = "pagebuilder-heading-" + data.heading_type();
        if (data.heading_text() === "") {
            styles += " placeholder-text";
        }
        return styles;
    }
}
