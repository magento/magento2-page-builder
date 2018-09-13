/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import ConditionalRemoveOption from "../../content-type-menu/conditional-remove-option";
import {OptionsInterface} from "../../content-type-menu/option.d";
import ButtonsPreview from "../buttons/preview";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    private buttonPlaceholder: string = $t("Edit Button Text");

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
     * On focus out
     *
     * @param {number} index
     * @param {Event} event
     */
    public onFocusOut(index: number, event: JQueryEventObject): void {
        const parentPreview = this.parent.parent.preview as ButtonsPreview;
        if (!event.relatedTarget) {
            if (parentPreview.focusedButton() === index) {
                window.getSelection().removeAllRanges();
                parentPreview.focusedButton(null);
            }
        } else {
            // Have we moved the focus onto another button in the current group?
            if ($.contains(parentPreview.wrapperElement, event.relatedTarget)) {
                const buttonItem = ko.dataFor(event.relatedTarget) as Preview;
                if (buttonItem) {
                    $(buttonItem.wrapperElement).find("[contenteditable]").focus();
                }
            } else {
                window.getSelection().removeAllRanges();
                parentPreview.focusedButton(null);
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
        const parentPreview = this.parent.parent.preview as ButtonsPreview;
        parentPreview.focusedButton(index);
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
