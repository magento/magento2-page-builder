/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { OptionInterface } from './options/option.d';
import { Structural } from './abstract.d';
import _ from 'underscore';
import ko from 'knockout';
'use strict';

export class Options {
    parent: Structural;
    private options: KnockoutObservableArray<OptionInterface> = ko.observableArray([]);
    template: string = 'Gene_BlueFoot/component/stage/structural/options.html';

    /**
     * Options constructor
     *
     * @param parent
     * @param options
     */
    constructor(parent: Structural, options: Array<OptionInterface>) {
        this.parent = parent;
        this.options(options);
        this.sort();
    }

    /**
     * Sort the options
     */
    private sort(): void {
        this.options.sort(function (a, b) {
            return a.sort === b.sort ? 0 : (a.sort < b.sort ? -1 : 1)
        });
    }

    /**
     * Add an option into the options array
     *
     * @param option
     */
    addOption(option: OptionInterface) {
        this.options.push(option);
        this.sort();
    }

    /**
     * Remove an option
     *
     * @param code
     */
    removeOption(code: string) {
        this.options(_.without(this.options(), _.findWhere(this.options(), {
            code: code
        })));
        this.sort();
    }
}