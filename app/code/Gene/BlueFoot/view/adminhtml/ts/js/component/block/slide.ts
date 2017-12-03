/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import _ from 'underscore';

export default class Slide extends Block {

    /**
     * Get the styles with parents text alignment
     *
     * @returns {boolean}
     */
    getStylesWithoutTextAlign() {
        let oldStyle = this.getStyle();
        let style = _.clone(oldStyle);
        style.textAlign = "";
        return style;
    }
}
