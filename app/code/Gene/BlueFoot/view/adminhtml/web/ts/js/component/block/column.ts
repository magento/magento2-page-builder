/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import ColumnGroup from "./column-group";
import $ from "jquery";
import $t from "mage/translate";
import {Option} from "../stage/structural/options/option";

export default class Column extends Block {
    parent: ColumnGroup;
    element: JQuery;

    /**
     * Make a reference to the element in the column
     *
     * @param element
     */
    public initColumn(element) {
        this.element = $(element);
    }

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    get options(): Array<Option> {
        let options = super.options,
            newOptions = options.filter((option) => {
                return (option.code !== 'move');
            });
        newOptions.unshift(
            new Option(this, 'move', '<i></i>', $t('Move'), false, ['move-column'], 10),
        );
        return newOptions;
    }

    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */
    public initResizeHandle(handle) {
        return this.parent.registerResizeHandle(this, $(handle));
    }
}
