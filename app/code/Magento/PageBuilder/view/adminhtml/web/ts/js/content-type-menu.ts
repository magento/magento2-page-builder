/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import OptionInterface from "./content-type-menu/option.d";
import Preview from "./content-type/preview";

/**
 * @api
 */
export default class ContentTypeMenu {
    private parent: Preview;
    private options: KnockoutObservableArray<OptionInterface> = ko.observableArray([]);

    /**
     * Options constructor
     *
     * @param parent
     * @param options
     */
    constructor(parent: Preview, options: OptionInterface[]) {
        this.parent = parent;
        options.forEach((option) => {
            this.addOption(option);
        });
    }

    get template(): string {
         return "Magento_PageBuilder/content-type/menu";
    }

    /**
     * Add an option into the content type menu
     *
     * @param {OptionInterface} option
     */
    public addOption(option: OptionInterface) {
        this.options.push(option);
        this.sort();
    }

    /**
     * Remove an option
     *
     * @param {string} code
     */
    public removeOption(code: string): void {
        this.options(this.options().filter((option: OptionInterface) => {
            return (option.code !== code);
        }));
        this.sort();
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
