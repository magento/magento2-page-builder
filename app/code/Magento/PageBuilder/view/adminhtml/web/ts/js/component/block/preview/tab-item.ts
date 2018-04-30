/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import PreviewCollection from "../../../preview-collection";
import {Options} from "../../stage/structural/options";
import {Option} from "../../stage/structural/options/option";
import {OptionInterface} from "../../stage/structural/options/option.d";

export default class TabItem extends PreviewCollection {

    protected fieldsToIgnoreOnRemove: string[] = ["tab_name"];

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    public getOptions(): Options {
        const options = super.getOptions();
        options.removeOption("move");
        options.removeOption("title");
        return options;
    }

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
        if (this.parent.parent.children().length <= 1) {
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
}
