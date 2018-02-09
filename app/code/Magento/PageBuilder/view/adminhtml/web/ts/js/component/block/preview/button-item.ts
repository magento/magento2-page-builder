/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Block from "../block";
import PreviewBlock from "./block";

export default class Button extends PreviewBlock {

    /**
     * After child render record element
     * returns {object}
     */
    public childrenStyle(): {} {
        return {
            display: "inline-block",
        };
    }
}
