/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import ContentTypeReadyEventParamsInterface from "../content-type-ready-event-params";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    private buttonPlaceholder: string = $t("Edit Button Text");

    /**
     * Bind events
     */
    public bindEvents(): void {
        super.bindEvents();

        events.on(`${this.config.name}:mountAfter`, (args: ContentTypeReadyEventParamsInterface) => {
            if (args.id === this.parent.id) {
                // Disable the remove option when there is only a single button
                const removeOption = this.getOptions().getOption("remove");
                if (this.parent.parent.children().length < 2) {
                    removeOption.disabled(true);
                }
                this.parent.parent.children.subscribe((children) => {
                    removeOption.disabled((children.length < 2));
                });
            }
        });
    }

    /**
     * Focus out of the element
     */
    public onFocusOut(): void {
        this.parent.parent.preview.isLiveEditing(null);
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
