/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import ConditionalRemoveOption from "../../content-type-menu/conditional-remove-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import ButtonsPreview from "../buttons/preview";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    public buttonPlaceholder: string = $t("Edit Button Text");

    /**
     * Use the conditional remove to disable the option when the parent has a single child
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();
        delete options.title;
        delete options.move;
        options.remove = new ConditionalRemoveOption({
            ...options.remove.config,
            preview: this,
        });
        return options;
    }

    /**
     * Force the focus on the clicked button
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */
    public onClick(index: number, event: JQueryEventObject): void {
        $(event.currentTarget).find("[contenteditable]").focus();
        event.stopPropagation();
    }

    /**
     * Handle on focus out events, when the button item is focused out we need to set our focusedButton record on the
     * buttons preview item to null. If we detect this focus out event is to focus into another button we need to ensure
     * we update the record appropriately.
     *
     * @param {number} index
     * @param {Event} event
     */
    public onFocusOut(index: number, event: JQueryEventObject): void {
        if (this.contentType && this.contentType.parentContentType) {
            const parentPreview = this.contentType.parentContentType.preview as ButtonsPreview;
            const unfocus = () => {
                window.getSelection().removeAllRanges();
                parentPreview.focusedButton(null);
            };
            if (event.relatedTarget && $.contains(parentPreview.wrapperElement, event.relatedTarget)) {
                // Verify the focus was not onto the options menu
                if ($(event.relatedTarget).closest(".pagebuilder-options").length > 0) {
                    unfocus();
                } else {
                    // Have we moved the focus onto another button in the current group?
                    const buttonItem = ko.dataFor(event.relatedTarget) as Preview;
                    if (buttonItem && buttonItem.contentType && buttonItem.contentType.parentContentType
                        && buttonItem.contentType.parentContentType.id === this.contentType.parentContentType.id
                    ) {
                        const newIndex = buttonItem
                            .contentType
                            .parentContentType.children()
                            .indexOf(buttonItem.contentType);
                        parentPreview.focusedButton(newIndex);
                    } else {
                        unfocus();
                    }
                }
            } else if (parentPreview.focusedButton() === index) {
                unfocus();
            }
        }
    }

    /**
     * On focus in set the focused button
     *
     * @param {number} index
     * @param {Event} event
     */
    public onFocusIn(index: number, event: Event): void {
        const parentPreview = this.contentType.parentContentType.preview as ButtonsPreview;
        if (parentPreview.focusedButton() !== index) {
            parentPreview.focusedButton(index);
        }
    }

    /**
     * If the button is displayed we need to show the options menu on hover
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onButtonMouseOver(context: Preview, event: Event): void {
        if (this.display() === false) {
            this.onMouseOver(context, event);
        }
    }

    /**
     * If the button is displayed we need to hide the options menu on mouse out
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onButtonMouseOut(context: Preview, event: Event): void {
        if (this.display() === false) {
            this.onMouseOut(context, event);
        }
    }
}
