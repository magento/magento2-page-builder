/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import WysiwygSetup from "mage/adminhtml/wysiwyg/tiny_mce/setup";

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
            this.onFocused(() => {
                events.trigger("stage:interactionStart");
            });

            this.onBlurred(() => {
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
    public onEdited(callback: Function) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceChange",
            callback,
        );
    }

    /**
     * @param {Function} callback
     */
    public onFocused(callback: Function) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceFocus",
            callback,
        );
    }

    /**
     * @param {Function} callback
     */
    public onBlurred(callback: Function) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceBlur",
            callback,
        );
    }
}
