/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "uiEvents";
import Preview from "./content-type/preview";

export default {
    /**
     * Set state based on toolbar focusin event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    onFocusIn(context: Preview, event: Event): void {
        const currentContentTypeTarget = event.currentTarget.closest(".pagebuilder-content-type");
        $(currentContentTypeTarget).addClass("pagebuilder-toolbar-active");
        events.trigger("interaction:start");
    },

    /**
     * Set state based on toolbar focusout event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    onFocusOut(context: Preview, event: Event): void {
        const currentContentTypeTarget = event.currentTarget.closest(".pagebuilder-content-type");
        $(currentContentTypeTarget).removeClass("pagebuilder-toolbar-active");
        events.trigger("interaction:stop");
    },
};
