/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PreviewBlock from "./block";

export default class Heading extends PreviewBlock {

    /**
     * Get the banner wrapper attributes for the preview
     *
     * @returns {any}
     */
    public getHeadingStyles(): string {
        const data = this.data;
        let styles = "pagebuilder-heading-" + data.heading_type();
        if(data.title() === ""){
            styles += " placeholder-text"
        }
        return styles;
    }
}
