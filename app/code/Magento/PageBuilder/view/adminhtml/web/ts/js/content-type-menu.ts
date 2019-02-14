/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import _ from "underscore";
import OptionInterface, {OptionsInterface} from "./content-type-menu/option.types";
import Preview from "./content-type/preview";

/**
 * @api
 */
export default class ContentTypeMenu {
    private preview: Preview;
    private options: KnockoutObservableArray<OptionInterface> = ko.observableArray([]);

    /**
     * Options constructor
     *
     * @param preview
     * @param options
     */
    constructor(preview: Preview, options: OptionsInterface) {
        this.preview = preview;
        const codes = _.keys(options);
        _.values(options).forEach((option, index) => {
            option.code = codes[index];
            this.options.push(option);
        });
        this.sort();
    }

    get template(): string {
         return "Magento_PageBuilder/content-type/menu";
    }

    /**
     * Get an option from the options array
     *
     * @param {string} code
     * @returns {OptionInterface}
     */
    public getOption(code: string): OptionInterface {
        return this.options().find((option: OptionInterface) => {
            return (option.code === code);
        });
    }

    /**
     * Sort the options
     */
    private sort(): void {
        this.options.sort((a, b) => {
            return a.sort === b.sort ? 0 : (a.sort < b.sort ? -1 : 1);
        });
    }
}
