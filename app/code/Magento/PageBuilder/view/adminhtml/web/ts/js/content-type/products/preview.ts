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
import ContentTypeConfigInterface from "../../content-type-config";
import {DataObject} from "../../data-store";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    public displayPreview: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string>;
    private messages = {
        EMPTY: $t("Empty Products"),
        NO_RESULTS: $t("No products were found matching your condition"),
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
    protected afterObservablesUpdated(): void {
        super.afterObservablesUpdated();
        this.displayPreview(false);

        const data = this.parent.dataStore.get() as DataObject;

        if ((typeof data.conditions_encoded !== "string") || data.conditions_encoded.length === 0) {
            this.placeholderText(this.messages.EMPTY);

            return;
        }

        const url = Config.getConfig("preview_url");
        const requestConfig = {
            // Prevent caching
            method: "POST",
            data: {
                role: this.config.name,
                directive: this.data.main.html(),
            },
        };

        this.placeholderText(this.messages.LOADING);

        $.ajax(url, requestConfig)
            .done((response) => {
                if (typeof response.data !== "object" || !Boolean(response.data.content)) {
                    this.placeholderText(this.messages.NO_RESULTS);

                    return;
                }

                if (response.data.error) {
                    this.data.main.html(response.data.error);
                } else {
                    this.data.main.html(response.data.content);
                    this.displayPreview(true);
                }
            })
            .fail(() => {
                this.placeholderText(this.messages.UNKNOWN_ERROR);
            });
    }
}
