/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeInterface from "../../../../content-type";
import { OptionInterface } from "./option.d";

export class Option implements OptionInterface {
    public classes: string;
    public code: string;
    public icon: string;
    public parent: ContentTypeInterface;
    public sort: number;
    public title: string;
    public action: () => void;
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
        parent: ContentTypeInterface,
        code: string,
        icon: string,
        title: string,
        action: () => void,
        classes: string[],
        sort: number,
        optionTemplate?: string,
    ) {
        this.parent = parent;
        this.code = code;
        this.icon = icon;
        this.title = title;
        if (action) {
            this.action = action;
        } else {
            this.action = () => {
                return;
            };
        }
        this.classes = classes.join(" ");
        this.sort = sort;
        this.optionTemplate = optionTemplate;
    }

    get template(): string {
        return this.optionTemplate || null;
    }
}
