/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    public displayPreview: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * Bind events
     */
    /**
     * Open edit menu on video content type drop with a delay of 300ms
     */
    public bindEvents() {
        super.bindEvents();

        // When a map is dropped for the first time open the edit panel
        events.on("video:dropAfter", (args: {[key: string]: any}) => {
            if (args.id === this.parent.id) {
                setTimeout(() => {
                    this.edit.open();
                }, 300);
            }
        });
    }
}
