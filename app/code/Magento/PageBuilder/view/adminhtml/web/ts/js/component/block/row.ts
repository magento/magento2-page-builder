/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import { Option } from "../stage/structural/options/option";
import Block from "./block";

export default class Row extends Block {

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    get options(): Option[] {
        let removeOption;
        if (this.stage.children().length < 2) {
            removeOption = new Option(this, "remove", "<i></i>",
                $t("Remove"), () => { return; }, ["remove-structural disabled"], 100);
        } else {
            removeOption = new Option(this, "remove", "<i></i>",
                $t("Remove"), this.onOptionRemove, ["remove-structural"], 100);
        }
        return [
            new Option(this, "edit", "<i></i>", $t("Edit"), this.onOptionEdit, ["edit-block"], 50),
            new Option(
                this,
                "duplicate",
                "<i class='icon-pagebuilder-copy'></i>",
                $t("Duplicate"),
                this.onOptionDuplicate,
                ["duplicate-structural"],
                60,
            ),
            removeOption,
        ];
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
