/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Preview from "./content-type/preview";

export class ToolbarOptions {
    public options: KnockoutObservableArray<ToolbarOptionsInterface> = ko.observableArray([]);
    private parent: Preview;

    /**
     * Toolbar Options constructor
     *
     * @param parent
     * @param options
     */
    constructor(parent: Preview, options: ToolbarOptionsInterface[]) {
        this.parent = parent;
        this.options(options);
    }

    get template(): string {
         return "Magento_PageBuilder/content-type/toolbar";
    }

    /**
     * Upon clicking the option update the value as directed
     * When user toggles the option off, set the value back to default
     *
     * @param {ToolbarOptionsInterface} option
     * @param {ToolbarOptionsValueInterface} value
     */
    public onClickOption(option: ToolbarOptionsInterface, value: ToolbarOptionsValueInterface) {
        const defaultValue: string = this.parent.config.fields[option.key].default;
        const currentValue: string = this.parent.previewData[option.key]();
        if (currentValue === value.value) {
            this.parent.updateData(option.key, defaultValue);
        } else {
            this.parent.updateData(option.key, value.value);
        }
    }
}

export interface ToolbarOptionsInterface {
    key: string;
    type: string;
    options: ToolbarOptionsValueInterface[];
}
export interface ToolbarOptionsValueInterface {
    value: string;
    label: string;
    icon: string;
}
