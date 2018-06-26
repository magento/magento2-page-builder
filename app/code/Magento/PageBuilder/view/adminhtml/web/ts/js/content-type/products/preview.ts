/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "uiEvents";
import Config from "../../config";
import BasePreview from "../preview";

export default class Preview extends BasePreview {
    public displayPreview: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string> = ko.observable($t("Empty Products"));

    /**
     * Bind events
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

        events.on("previewObservables:updated", (event, params) => {
            if (event.preview.parent.id !== this.parent.id) {
                return;
            }
            this.placeholderText($t("Loading..."));
            this.displayPreview(false);

            const data = this.parent.dataStore.get();

            if ((typeof data.conditions_encoded !== "string") || data.conditions_encoded.length === 0) {
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

            $.ajax(url, requestConfig)
                .done((response) => {
                    const content = response.content !== undefined ? response.content.trim() : "";
                    if (content.length === 0) {
                        this.placeholderText($t("Empty Products"));

                        return;
                    }

                    this.data.main.html(content);
                    this.displayPreview(true);
                })
                .fail(() => {
                    this.placeholderText($t("An unknown error occurred. Please try again."));
                });
        });
    }
}
