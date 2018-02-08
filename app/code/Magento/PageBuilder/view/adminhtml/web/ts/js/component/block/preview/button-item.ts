/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Block from "../block";
import PreviewBlock from "./block";

export default class Button extends PreviewBlock {

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
    }

    /**
     * After child render record element
     *
     */
    public childrenStyle() {
        return {display: 'inline-block'};
    }
}
