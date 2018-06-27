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
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";

export default class Preview extends BasePreview {
    public displayPreview: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string>;
    private messages = {
        EMPTY: $t("Empty Products"),
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
        this.placeholderText = ko.observable(this.messages.EMPTY);
    }

    /**
     * @inheritdoc
     */
    protected bindEvents() {
        super.bindEvents();

        // When a products type is dropped for the first time open the edit panel
        events.on("products:contentType:dropped:create", (event: Event, params: { [key: string]: any }) => {
            if (event.id === this.parent.id) {
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
        this.displayPreview(false);

        const data = this.parent.dataStore.get();

        if ((typeof data.conditions_encoded !== "string") || data.conditions_encoded.length === 0) {
            this.placeholderText(this.messages.EMPTY);
            return;
        }

        const url = Config.getConfig("preview_url");
        const requestConfig = {
            method: "GET",
            data: {
                role: this.config.name,
                directive: this.data.main.html(),
            },
        };

        this.placeholderText(this.messages.LOADING);

        $.ajax(url, requestConfig)
            .done((response) => {
                const content = response.data !== undefined ? response.data.trim() : "";
                if (content.length === 0) {
                    this.placeholderText(this.messages.EMPTY);

                    return;
                }

                this.data.main.html(content);
                this.displayPreview(true);
            })
            .fail(() => {
                this.placeholderText(this.messages.UNKNOWN_ERROR);
            });
    }
}
