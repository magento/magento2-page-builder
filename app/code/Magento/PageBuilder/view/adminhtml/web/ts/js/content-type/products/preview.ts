/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import Config from "../../config";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params";
import BasePreview from "../preview";

export default class Preview extends BasePreview {
    public displayPreview: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * Bind events
     */
    protected bindEvents() {
        super.bindEvents();

        // When a products type is dropped for the first time open the edit panel
        events.on("products:createAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.parent.id) {
                setTimeout(() => {
                    this.edit.open();
                }, 300);
            }
        });

        events.on("previewData:updateAfter", (event, params) => {
            if (event.preview.parent.id !== this.parent.id) {
                return;
            }
            this.displayPreview(false);

            const data = this.parent.dataStore.get();

            if ((typeof data.conditions_encoded !== "string") || data.conditions_encoded.length === 0) {
                return;
            }

            const url = Config.getConfig("preview_url");
            const requestData = {
                role: this.config.name,
                directive: this.data.main.html(),
            };

            $.post(url, requestData, (response) => {
                const content = response.content !== undefined ? response.content.trim() : "";
                if (content.length === 0) {
                    return;
                }
                this.data.main.html(content);
                this.displayPreview(true);
            });
        });
    }
}
