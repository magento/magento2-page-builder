/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $t from "mage/translate";
import Preview from "../../../../preview";
import {OptionInterface} from "./option.d";

export class TitleOption implements OptionInterface {
    public parent: Preview;
    public name: string;
    public sort: number;

    /**
     * @param {Preview} parent
     * @param {number} sort
     */
    constructor(
        parent: Preview,
        name: string,
        sort: number,
    ) {
        this.parent = parent;
        this.name = name || $t("Block");
        this.sort = sort;
    }

    get template(): string {
        return "Magento_PageBuilder/component/stage/structural/options/title.html";
    }
}
