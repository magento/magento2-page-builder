/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import widgetInitializer from "Magento_PageBuilder/js/widget-initializer";
import Config from "../../config";
import ContentTypeInterface from "../../content-type";
import ContentTypeConfigInterface from "../../content-type-config";
import {DataObject} from "../../data-store";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    public displayingBlockPreview: KnockoutObservable<boolean> = ko.observable(false);
    public loading: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string>;
    private lastBlockId: number;
    private lastTemplate: string;
    private lastRenderedHtml: string;
    private messages = {
        NOT_SELECTED: $t("Empty Block"),
        UNKNOWN_ERROR: $t("An unknown error occurred. Please try again."),
    };

    /**
     * @inheritdoc
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);
        this.placeholderText = ko.observable(this.messages.NOT_SELECTED);
    }

    /**
     * Runs the widget initializer for each configured widget
     */
    public initializeWidgets() {
        widgetInitializer({
            config: Config.getConfig("widgets"),
        });
    }

    /**
     * @inheritdoc
     */
    protected bindEvents() {
        super.bindEvents();
        // When a block type is dropped for the first time open the edit panel
        events.on("block:dropAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.parent.id) {
                setTimeout(() => {
                    this.openEdit();
                }, 300);
            }
        });
    }

    /**
     * @inheritdoc
     */
    protected afterObservablesUpdated(): void {
        super.afterObservablesUpdated();

        const data = this.parent.dataStore.get() as DataObject;

        // Only load if something changed
        if (this.lastBlockId === data.block_id && this.lastTemplate === data.template) {
            // The mass converter will have transformed the HTML property into a directive
            if (this.lastRenderedHtml) {
                this.data.main.html(this.lastRenderedHtml);
                this.showBlockPreview(true);
            }
        } else {
            this.showBlockPreview(false);
            this.placeholderText("");
        }

        if (!data.block_id || data.template.length === 0) {
            this.showBlockPreview(false);
            this.placeholderText(this.messages.NOT_SELECTED);
            return;
        }

        this.loading(true);

        const url = Config.getConfig("preview_url");
        const requestConfig = {
            // Prevent caching
            method: "POST",
            data: {
                role: this.config.name,
                block_id: data.block_id,
                directive: this.data.main.html(),
            },
        };

        // Retrieve a state object representing the block from the preview controller and process it on the stage
        $.ajax(url, requestConfig)
            // The state object will contain the block name and either html or a message why there isn't any.
            .done((response) => {
                // Empty content means something bad happened in the controller that didn't trigger a 5xx
                if (typeof response.data !== "object") {
                    this.showBlockPreview(false);
                    this.placeholderText(this.messages.UNKNOWN_ERROR);

                    return;
                }

                // Update the stage content type label with the real block title if provided
                this.displayLabel(response.data.title ? response.data.title : this.config.label);

                if (response.data.content) {
                    this.showBlockPreview(true);
                    this.data.main.html(response.data.content);
                } else if (response.data.error) {
                    this.showBlockPreview(false);
                    this.placeholderText(response.data.error);
                }

                this.lastBlockId = parseInt(data.block_id.toString(), 10);
                this.lastTemplate = data.template.toString();
                this.lastRenderedHtml = response.data.content;
            })
            .fail(() => {
                this.showBlockPreview(false);
                this.placeholderText(this.messages.UNKNOWN_ERROR);
            })
            .always(() => {
                this.loading(false);
            });
    }

    /**
     * Toggle display of block preview.  If showing block preview, add hidden mode to PB preview.
     * @param {boolean} isShow
     */
    private showBlockPreview(isShow: boolean) {
        this.displayingBlockPreview(isShow);

        // preview is hidden only if block is shown
        this.display(!isShow);
    }
}
