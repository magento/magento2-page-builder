/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

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
     * @param {String} mode
     * @param {Object} config
     */
    constructor(id: string, config: object, mode: string) {
        this.wysiwygAdapter = new WysiwygSetup(id + "-editor", config);

        if (mode) {
            this.wysiwygAdapter.setup(mode);
        }
    }

    /**
     * @returns {WysiwygSetup}
     */
    getAdapter() {
        return this.wysiwygAdapter;
    }

    /**
     * @param {Function} callback
     */
    onEdited(callback: Function) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceChange",
            callback,
        );
    }

    /**
     * @param {Function} callback
     */
    onFocused(callback: Function) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceFocus",
            callback,
        );
    }

    /**
     * @param {Function} callback
     */
    onBlurred(callback: Function) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceBlur",
            callback,
        );
    }
}
