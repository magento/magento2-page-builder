/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import Config from "../../config";
import ContentTypeInterface from "../../content-type";
import createContentType from "../../content-type-factory";
import Option from "../../content-type-menu/option";
import OptionInterface from "../../content-type-menu/option.d";
import ContentTypeAfterRenderEventParamsInterface from "../content-type-after-render-event-params";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params";
import ContentTypeRemovedEventParamsInterface from "../content-type-removed-event-params";
import PreviewCollection from "../preview-collection";
import PreviewDataUpdateAfterParamsInterface from "../preview-data-update-after-params";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public isLiveEditing: KnockoutObservable<boolean> = ko.observable(false);

    public bindEvents() {
        super.bindEvents();

        events.on("buttons:dropAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.parent.id && this.parent.children().length === 0) {
                this.addButton();
            }
        });

        events.on("previewData:updateAfter", (eventData: PreviewDataUpdateAfterParamsInterface) => {
            const contentTypePreview = eventData.preview;
            if ((contentTypePreview.config.name === "button-item"
                && contentTypePreview.parent.parent.id === this.parent.id)
                || (contentTypePreview.config.name === "buttons"
                    && contentTypePreview.parent.id === this.parent.id)) {
                this.resizeChildButtons();
            }
        });

        events.on("button-item:renderAfter", (eventData: ContentTypeAfterRenderEventParamsInterface) => {
            if (eventData.contentType.parent.id === this.parent.id) {
                this.resizeChildButtons();
            }
        });

        events.on("button-item:removeAfter", (eventData: ContentTypeRemovedEventParamsInterface) => {
            if (eventData.parent.id === this.parent.id) {
                this.resizeChildButtons();
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
        const createButtonItemPromise: Promise<ContentTypeInterface> = createContentType(
            Config.getContentTypeConfig("button-item"),
            this.parent.parent,
            this.parent.stageId,
            {},
        );

        createButtonItemPromise.then((button: ContentTypeInterface) => {
            this.parent.addChild(button);
            this.isLiveEditing(this.parent.children().indexOf(button) !== -1);
            return button;
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    /**
     * Resize width of all child buttons. Dependently make them the same width if configured.
     */
    private resizeChildButtons() {
        if (this.wrapperElement) {
            const buttonItems: JQuery = $(this.wrapperElement).find(".pagebuilder-button-item > a");
            let buttonResizeValue: string|number = "";
            if (this.parent.dataStore.get("same_width") === "1") {
                if (buttonItems.length > 0) {
                    const currentLargestButton = this.findLargestButton(buttonItems);
                    buttonResizeValue = currentLargestButton.css("min-width", "").outerWidth();
                }
            }

            buttonItems.css("min-width", buttonResizeValue);
        }
    }

    /**
     * Find the largest button which will determine the button width we use for re-sizing.
     *
     * @param {JQuery} buttonItems
     * @returns {JQuery}
     */
    private findLargestButton(buttonItems: JQuery): JQuery {
        let largestButton: JQuery|null = null;
        buttonItems.each((index, element) => {
            const buttonElement = $(element);
            if (largestButton === null
                || this.calculateButtonWidth(buttonElement) > this.calculateButtonWidth(largestButton)) {
                largestButton = buttonElement;
            }
        });

        return largestButton;
    }

    /**
     * Manually calculate button width using content plus box widths (padding, border)
     *
     * @param {JQuery} buttonItem
     * @returns {number}
     */
    private calculateButtonWidth(buttonItem: JQuery): number {
        const widthProperties = ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
        const calculatedButtonWidth: number = widthProperties.reduce((accumulatedWidth, widthProperty): number => {
            return accumulatedWidth + (parseInt(buttonItem.css(widthProperty), 10) || 0);
        }, buttonItem.find("span").width());

        return calculatedButtonWidth;
    }
}
