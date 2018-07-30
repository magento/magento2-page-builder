/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import WysiwygSetup from "mage/adminhtml/wysiwyg/tiny_mce/setup";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";

/**
 * @api
 */
export default class Wysiwyg {
    /**
     * Wysiwyg adapter instance
     */
    private wysiwygAdapter: WysiwygSetup;

    /**
     * @param {String} id
     * @param {Object} config
     * @param {String} mode
     */
    constructor(id: string, config: object, mode: string) {
        this.wysiwygAdapter = new WysiwygSetup(id, config);

        if (mode) {
            this.wysiwygAdapter.setup(mode);
        }

        if (mode === "inline") {
            // prevent interactability with options when in inline editing mode
            this.onFocused(() => {
                $(`#${id}`).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");
                events.trigger("stage:interactionStart");
            });

            // resume normal interactability with opens when leaving inline editing mode
            this.onBlurred(() => {
                window.getSelection().empty();
                $(`#${id}`).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");
                events.trigger("stage:interactionStop");
            });
        }
    }

    /**
     * @returns {WysiwygSetup}
     */
    public getAdapter() {
        return this.wysiwygAdapter;
    }

    /**
     * @param {Function} callback
     */
    public onEdited(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceChange",
            _.debounce(callback, 100),
        );
    }

    /**
     * @param {Function} callback
     */
    public onFocused(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceFocus",
            callback,
        );
    }

    /**
     * @param {Function} callback
     */
    public onBlurred(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceBlur",
            callback,
        );
    }
}
