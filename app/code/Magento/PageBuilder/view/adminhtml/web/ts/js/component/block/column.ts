/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import {Option} from "../stage/structural/options/option";
import Block from "./block";
import ColumnGroup from "./column-group";

export default class Column extends Block {
    public resizing: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * Make a reference to the element in the column
     *
     * @param element
     */
    public initColumn(element: Element) {
        this.element = $(element);
    }

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    get options(): Option[] {
        const options = super.options;
        const newOptions = options.filter((option) => {
                return (option.code !== "move");
            });
        newOptions.unshift(
            new Option(this, "move", "<i></i>", $t("Move"), null, ["move-column"], 10),
        );
        return newOptions;
    }

    /**
     * Init the resize handle for the resizing functionality
     *
     * @param handle
     */
    public initResizeHandle(handle: Element) {
        return (this.parent as ColumnGroup).registerResizeHandle(this, $(handle));
    }
}
