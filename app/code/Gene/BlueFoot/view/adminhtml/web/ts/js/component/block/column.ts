/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import ColumnGroup from "./column-group";
import $ from "jquery";

export default class Column extends Block {
    parent: ColumnGroup;

    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */
    public initResizeHandle(handle) {
        return this.parent.registerResizeHandle(this, $(handle));
    }
}
