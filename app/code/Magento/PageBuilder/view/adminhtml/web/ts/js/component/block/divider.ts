/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";

export default class Divider extends Block {

    /**
     * Get divider styles
     *
     * @returns {any}
     */
    public getLineStyle() {
        const data = this.getData();

        return {width: data.line_width, borderWidth: data.line_thickness + "px", borderColor: data.line_color};
    }
}
