/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $t from "mage/translate";
import Structural from "../abstract";
import {OptionInterface} from "./option.d";

export class TitleOption implements OptionInterface {
    public parent: Structural;
    public name: string;
    public sort: number;
    public code: string;

    /**
     * @param {Structural} parent
     * @param {number} sort
     */
    constructor(
        parent: Structural,
        name: string,
        sort: number,
    ) {
        this.parent = parent;
        this.name = name || $t("Block");
        this.sort = sort;
        this.code = "title";
    }

    get template(): string {
        return "Magento_PageBuilder/component/stage/structural/options/title.html";
    }
}
