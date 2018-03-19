/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import {Option} from "../stage/structural/options/option";
import {OptionInterface} from "../stage/structural/options/option.d";
import Block from "./block";

export default class Row extends Block {

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    public retrieveOptions(): OptionInterface[] {
        const options = super.retrieveOptions();
        const newOptions = options.filter((option) => {
            return (option.code !== "remove");
        });
        const removeClasses = ["remove-structural"];
        let removeFn = this.onOptionRemove;
        if (this.stage.children().length < 2) {
            removeFn = () => { return; };
            removeClasses.push("disabled");
        }
        newOptions.push(new Option(
            this,
            "remove",
            "<i class='icon-admin-pagebuilder-remove'></i>",
            $t("Remove"),
            removeFn,
            removeClasses,
            100,
        ));
        return newOptions;
    }

    /**
     * Get stype properties for an block
     * Example {"backgroundColor": "#cccccc"}
     *
     * @returns {DataObject}
     */
    public getStyle() {
        const children: any = this.children();
        const styleAttributes: any  = {};
        let isAllColumns: boolean = true;

        if (children.length !== 0) {
            for (const child of children) {
                if (child.config.name !== "column") {
                    isAllColumns = false;
                }
            }
        } else {
            isAllColumns = false;
        }
        if (isAllColumns) {
            styleAttributes.display = "flex";
        }
        return _.extend(super.getStyle(), styleAttributes);
    }
}
