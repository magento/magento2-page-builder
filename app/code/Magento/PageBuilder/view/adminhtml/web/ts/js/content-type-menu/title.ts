/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Preview from "../content-type/preview";
import OptionInterface from "./option.d";

export default class TitleOption implements OptionInterface {
    public parent: Preview;
    public name: string;
    public sort: number;
    public code: string;

    /**
     * @param {Preview} parent
     * @param {string} name
     * @param {number} sort
     */
    constructor(
        parent: Preview,
        name: string,
        sort: number,
    ) {
        this.parent = parent;
        this.name = name;
        this.sort = sort;
        this.code = "title";
    }

    get template(): string {
        return "Magento_PageBuilder/content-type/title";
    }
}
