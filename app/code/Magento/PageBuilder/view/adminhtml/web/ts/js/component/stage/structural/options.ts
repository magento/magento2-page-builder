/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import _ from "underscore";
import { Structural } from "./abstract.d";
import { OptionInterface } from "./options/option.d";

export class Options {
    private parent: Structural;
    private options: KnockoutObservableArray<OptionInterface> = ko.observableArray([]);

    /**
     * Options constructor
     *
     * @param parent
     * @param options
     */
    constructor(parent: Structural, options: OptionInterface[]) {
        this.parent = parent;
        this.options(options);
        this.sort();
    }

    get template(): string {
         return "Magento_PageBuilder/component/stage/structural/options.html";
    }

    /**
     * Add an option into the options array
     *
     * @param option
     */
    public addOption(option: OptionInterface) {
        this.options.push(option);
        this.sort();
    }

    /**
     * Remove an option
     *
     * @param code
     */
    public removeOption(code: string) {
        this.options(this.options().filter((option: OptionInterface) => {
            return (option.code !== code);
        }));
        this.sort();
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
