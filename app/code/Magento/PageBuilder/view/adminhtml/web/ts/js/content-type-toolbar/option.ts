/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Preview from "./content-type/preview";
import OptionInterface from "./option.d";
import ValueInterface from "./value.d";

export default class ToolbarOption {
    public options: KnockoutObservableArray<OptionInterface> = ko.observableArray([]);
    private preview: Preview;

    /**
     * Toolbar Options constructor
     *
     * @param preview
     * @param options
     */
    constructor(preview: Preview, options: OptionInterface[]) {
        this.preview = preview;
        this.options(options);
    }

    /**
     * Toolbar template
     *
     * @returns {string}
     */
    get template(): string {
         return "Magento_PageBuilder/content-type/toolbar";
    }

    /**
     * Upon clicking the option update the value as directed
     * When user toggles the option off, set the value back to default
     *
     * @param {OptionInterface} option
     * @param {ValueInterface} value
     */
    public onClickOption(option: OptionInterface, value: ValueInterface) {
        const defaultValue: string = this.preview.config.fields[option.key].default;
        const currentValue: string = this.preview.previewData[option.key]();
        if (currentValue === value.value) {
            this.preview.updateData(option.key, defaultValue);
        } else {
            this.preview.updateData(option.key, value.value);
        }
    }
}
