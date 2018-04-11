/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $t from "mage/translate";
import ContentTypeInterface from "../../../../content-type";
import {OptionInterface} from "./option.d";

export class TitleOption implements OptionInterface {
    public parent: ContentTypeInterface;
    public name: string;
    public sort: number;

    /**
     * @param {Structural} parent
     * @param {number} sort
     */
    constructor(
        parent: ContentTypeInterface,
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
