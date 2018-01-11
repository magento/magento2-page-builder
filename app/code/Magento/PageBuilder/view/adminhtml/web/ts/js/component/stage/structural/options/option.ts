/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { Structural } from "../abstract.d";
import { OptionInterface } from "./option.d";

export class Option implements OptionInterface {
    public action: () => void | false;
    public classes: string;
    public code: string;
    public icon: string;
    public parent: Structural;
    public sort: number;
    public title: string;
    public optionTemplate: string;

    /**
     * Option constructor
     *
     * @param parent
     * @param code
     * @param icon
     * @param title
     * @param action
     * @param classes
     * @param sort
     * @param optionTemplate
     */
    constructor(
        parent: Structural,
        code: string,
        icon: string,
        title: string,
        action: () => void | false,
        classes: string[],
        sort: number,
        optionTemplate?: string,
    ) {
        this.parent = parent;
        this.code = code;
        this.icon = icon;
        this.title = title;
        this.action = action;
        this.classes = classes.join(" ");
        this.sort = sort;
        this.optionTemplate = optionTemplate;
    }

    get template(): string {
        return this.optionTemplate || null;
    }
}
