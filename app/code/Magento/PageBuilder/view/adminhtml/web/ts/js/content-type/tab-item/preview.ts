/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import ConditionalRemoveOption from "../../content-type-menu/conditional-remove-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import PreviewCollection from "../preview-collection";
import TabsPreview from "../tabs/preview";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    /**
     * Fields that should not be considered when evaluating whether an object has been configured.
     *
     * @see {Preview.isConfigured}
     * @type {[string]}
     */
    protected fieldsToIgnoreOnRemove: string[] = ["tab_name"];

    /**
     * Get background image url base on the viewport.
     *
     * @returns {string}
     */
    public getBackgroundImage(): string {
        const mobileImage = (this.contentType.dataStore.get("mobile_image") as any[]);
        const desktopImage = (this.contentType.dataStore.get("background_image") as any[]);
        const backgroundImage = this.viewport() === "mobile" && mobileImage.length ?
            mobileImage :
            desktopImage;

        return backgroundImage.length ? `url("${backgroundImage[0].url}")` : "none";
    }

    /**
     * Force the focus on the clicked tab header
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */
    public onClick(index: number, event: JQueryEventObject): void {
        $(event.currentTarget).find("[contenteditable]").focus();
        event.stopPropagation();
    }

    /**
     * On focus in set the focused button
     *
     * @param {number} index
     * @param {Event} event
     */
    public onFocusIn(index: number, event: Event): void {
        const parentPreview = this.contentType.parentContentType.preview as TabsPreview;
        if (parentPreview.focusedTab() !== index) {
            parentPreview.setFocusedTab(index, true);
        }
    }

    /**
     * On focus out set the focused tab to null
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */
    public onFocusOut(index: number, event: JQueryEventObject): void {
        if (this.contentType && this.contentType.parentContentType) {
            const parentPreview = this.contentType.parentContentType.preview as TabsPreview;
            const unfocus = () => {
                window.getSelection().removeAllRanges();
                parentPreview.focusedTab(null);
            };
            if (event.relatedTarget && $.contains(parentPreview.wrapperElement, event.relatedTarget)) {
                // Verify the focus was not onto the options menu
                if ($(event.relatedTarget).closest(".pagebuilder-options").length > 0) {
                    unfocus();
                } else {
                    // Have we moved the focus onto another button in the current group?
                    const tabItem = ko.dataFor(event.relatedTarget) as Preview;
                    if (tabItem &&
                        tabItem.contentType &&
                        tabItem.contentType.parentContentType &&
                        tabItem.contentType.parentContentType.id ===
                        this.contentType.parentContentType.id
                    ) {
                        const newIndex = tabItem
                            .contentType
                            .parentContentType.children()
                            .indexOf(tabItem.contentType);
                        parentPreview.setFocusedTab(newIndex, true);
                    } else {
                        unfocus();
                    }
                }
            } else if (parentPreview.focusedTab() === index) {
                unfocus();
            }
        }
    }

    /**
     * Get the options instance
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();
        delete options.move;
        delete options.title;
        options.remove = new ConditionalRemoveOption({
            ...options.remove.config,
            preview: this,
        });
        return options;
    }
}
