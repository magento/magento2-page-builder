/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import confirmationDialog from "Magento_PageBuilder/js/modal/dismissible-confirm";
import EventBus from "../event-bus";
import {Options} from "../stage/structural/options";
import {Option} from "../stage/structural/options/option";
import {OptionInterface} from "../stage/structural/options/option.d";
import Block from "./block";

export default class TabItem extends Block {

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
        if (this.parent.children().length <= 1) {
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
     * Handle block removal
     */
    public onOptionRemove(): void {
        const removeBlock = () => {
            const params = {
                block: this,
                index: this.parent.children().indexOf(this),
                parent: this.parent,
            };
            EventBus.trigger("block:removed", params);
            EventBus.trigger(this.config.name + ":block:removed", params);
        };

        if (this.isConfigured()) {
            confirmationDialog({
                actions: {
                    confirm: () => {
                        // Call the parent to remove the child element
                        removeBlock();
                    },
                },
                content: $t("Are you sure you want to remove this item? The data within this item is not recoverable once removed."), // tslint:disable-line:max-line-length
                dismissKey: "pagebuilder_modal_dismissed",
                dismissible: true,
                title: $t("Confirm Item Removal"),
            });
        } else {
            removeBlock();
        }
    }

    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    private isConfigured() {
        if (this.children().length > 0) {
            return true;
        }

        const data = this.getData();
        let hasDataChanges = false;
        _.each(this.config.fields, (field, key: string) => {
            // ignore tab name
            if (key === "tab_name") {
                return;
            }
            let fieldValue = data[key];
            if (!fieldValue) {
                fieldValue = "";
            }
            // Default values can only ever be strings
            if (_.isObject(fieldValue)) {
                // Empty arrays as default values appear as empty strings
                if (_.isArray(fieldValue) && fieldValue.length === 0) {
                    fieldValue = "";
                } else {
                    fieldValue = JSON.stringify(fieldValue);
                }
            }
            if (_.isObject(field.default)) {
                if (JSON.stringify(field.default) !== fieldValue) {
                    hasDataChanges = true;
                }
            } else if (field.default !== fieldValue) {
                hasDataChanges = true;
            }
            return;
        });
        return hasDataChanges;
    }
}
