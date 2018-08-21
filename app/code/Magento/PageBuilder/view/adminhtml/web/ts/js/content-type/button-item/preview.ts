/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import $t from "mage/translate";
import Option from "../../content-type-menu/option";
import OptionInterface from "../../content-type-menu/option.d";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    private buttonPlaceholder: string = $t("Edit Button Text");

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    public retrieveOptions(): OptionInterface[] {
        const options = super.retrieveOptions();
        const newOptions = options.filter((option) => {
            return ["remove", "title", "move"].indexOf(option.code) === -1;
        });
        const removeClasses = ["remove-structural"];
        let removeFn = this.onOptionRemove;
        if (this.parent.parent.children().length < 2) {
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
     * Set state based on button click event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onButtonClick(context: Preview, event: Event): void {

        // Ensure no other options panel and button drag handles are displayed
        $(".pagebuilder-content-type-active").removeClass("pagebuilder-content-type-active");
        $(".pagebuilder-options-visible").removeClass("pagebuilder-options-visible");
        const currentTarget = $(event.currentTarget);
        let optionsMenu = $(currentTarget).find(".pagebuilder-options-wrapper");

        if (!$(currentTarget).hasClass("type-nested")) {
            optionsMenu = optionsMenu.first();
        }
        $(currentTarget).find("[data-element='link_text']").focus();
        optionsMenu.parent().addClass("pagebuilder-options-visible");
        $(currentTarget).addClass("pagebuilder-content-type-active");
    }

    /**
     * Set state based on blur event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onBlur(context: Preview, event: Event) {
        const currentTarget = event.currentTarget;
        let optionsMenu = $(currentTarget).find(".pagebuilder-options-wrapper");

        if (!$(currentTarget).hasClass("type-nested")) {
            optionsMenu = optionsMenu.first();
        }

        optionsMenu.parent().removeClass("pagebuilder-options-visible");
        $(currentTarget).removeClass("pagebuilder-content-type-active");
    }

    /**
     * Focus out of the element
     */
    private onFocusOut(): void {
        this.parent.parent.preview.isLiveEditing(null);
    }
}
