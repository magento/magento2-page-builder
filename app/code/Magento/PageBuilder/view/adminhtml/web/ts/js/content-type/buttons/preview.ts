/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "uiEvents";
import Config from "../../config";
import createContentType from "../../content-type-factory";
import Option from "../../content-type-menu/option";
import OptionInterface from "../../content-type-menu/option.d";
import ButtonItem from "../button-item/preview";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params";
import PreviewCollection from "../preview-collection";

export default class Preview extends PreviewCollection {
    public isLiveEditing: KnockoutObservable<boolean> = ko.observable(false);

    public bindEvents() {
        super.bindEvents();

        events.on("buttons:createAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.parent.id && this.parent.children().length === 0) {
                this.addButton();
            }
        });
    }

    /**
     * Set state based on mouseover event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onMouseOver(context: Preview, event: Event) {
        // Only run the mouse over action when the active element is not a child of buttons
        if (!$.contains(this.wrapperElement, document.activeElement)) {
            return super.onMouseOver(context, event);
        }
    }

    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */
    public retrieveOptions(): OptionInterface[] {
        const options = super.retrieveOptions();
        options.push(
            new Option(
                this,
                "add",
                "<i class='icon-pagebuilder-add'></i>",
                $t("Add Button"),
                this.addButton,
                ["add-child"],
                20,
            ),
        );
        return options;
    }

    /**
     * Add button-item to buttons children array
     */
    public addButton() {
        const createButtonItemPromise: Promise<ButtonItem> = createContentType(
            Config.getContentTypeConfig("button-item"),
            this.parent.parent,
            this.parent.stageId,
            {},
        );

        createButtonItemPromise.then((button: ButtonItem) => {
            this.parent.addChild(button);
            this.isLiveEditing(this.parent.children().indexOf(button));
            return button;
        }).catch((error: Error) => {
            console.error(error);
        });
    }
}
