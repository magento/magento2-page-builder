/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import WysiwygSetup from "mage/adminhtml/wysiwyg/tiny_mce/setup";

/**
 * @api
 */
export default class Wysiwyg {
    /**
     * Wysiwyg adapter instance
     */
    private wysiwygAdapter: WysiwygSetup;

    public isFocused: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * @param {String} id
     * @param {String} mode
     * @param {Object} config
     */
    constructor(id: string, config: object, mode: string) {
        this.wysiwygAdapter = new WysiwygSetup(id + '-editor', config);

        if (mode) {
            this.wysiwygAdapter.setup(mode);
        }

        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceFocus",
            this.hidePlaceholder.bind(this),
        );

        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceBlur",
            this.showPlaceholderIfContentIsEmpty.bind(this),
        );
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

    private hidePlaceholder() {
        console.log("hidePlaceholder");
        this.isFocused(true);
    }

    private showPlaceholderIfContentIsEmpty() {
        console.log("showPlaceholderIfContentIsEmpty");
        this.isFocused(false);
    }
}
