/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "uiEvents";
import Config from "../../config";
import ContentTypeInterface from "../../content-type";
import ContentTypeConfigInterface from "../../content-type-config";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";

export default class Preview extends BasePreview {
    public displayPreview: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string>;
    private lastBlockId: number;
    private lastTemplate: string;
    private lastRenderedHtml: string;
    private messages = {
        NOT_SELECTED: $t("Empty Block"),
        LOADING: $t("Loading..."),
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
     * @inheritdoc
     */
    protected bindEvents() {
        super.bindEvents();

        // When a block type is dropped for the first time open the edit panel
        events.on("block:contentType:dropped:create", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.parent.id) {
                setTimeout(() => {
                    this.edit.open();
                }, 300);
            }
        });
    }

    /**
     * @inheritdoc
     */
    protected afterObservablesUpdated(): void {
        super.afterObservablesUpdated();

        const data = this.parent.dataStore.get();

        // Only load if something changed
        if (this.lastBlockId === data.block_id && this.lastTemplate === data.template) {
            // The mass converter will have transformed the HTML property into a directive
            if (this.lastRenderedHtml) {
                this.data.main.html(this.lastRenderedHtml);
                this.displayPreview(true);
            }

            return;
        }

        this.displayPreview(false);

        if (!data.block_id || data.template.length === 0) {
            this.placeholderText(this.messages.NOT_SELECTED);

            return;
        }

        this.placeholderText(this.messages.LOADING);

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
                    this.placeholderText(this.messages.UNKNOWN_ERROR);

                    return;
                }

                // Update the stage content type label with the real block title if provided
                this.displayLabel(response.data.title ? response.data.title : this.config.label);

                if (response.data.content) {
                    this.displayPreview(true);
                    this.data.main.html(response.data.content);
                } else if (response.data.error) {
                    this.placeholderText(response.data.error);
                }

                this.lastBlockId = data.block_id;
                this.lastTemplate = data.template;
                this.lastRenderedHtml = response.data.content;
            })
            .fail(() => {
                this.placeholderText(this.messages.UNKNOWN_ERROR);
            });
    }
}
