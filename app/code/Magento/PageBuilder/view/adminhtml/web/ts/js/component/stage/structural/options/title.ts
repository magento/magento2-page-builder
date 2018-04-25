/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import Structural from "../abstract";
import {OptionInterface} from "./option.d";

export class TitleOption implements OptionInterface {
    public sort: number;
    public code: string;
    private parent: Structural;

    /**
     * @param {Structural} parent
     * @param {number} sort
     */
    constructor(
        parent: Structural,
        sort: number,
    ) {
        this.parent = parent;
        this.sort = sort;
        this.code = "title";
    }

    get template(): string {
        return "Magento_PageBuilder/component/stage/structural/options/title.html";
    }
}
