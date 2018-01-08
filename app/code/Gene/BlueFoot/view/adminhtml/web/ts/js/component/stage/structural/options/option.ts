/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { Structural } from "../abstract.d";
import { OptionInterface } from "./option.d";
'use strict';

export class Option implements OptionInterface {
    parent: Structural;
    code: string;
    icon: string;
    title: string;
    action: Function | false = false;
    classes: string;
    sort: number;
    _template: string;

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
     * @param template
     */
    constructor(
        parent: Structural,
        code: string,
        icon: string,
        title: string,
        action: Function | false,
        classes: Array<string>,
        sort: number,
        template?: string
    ) {
        this.parent = parent;
        this.code = code;
        this.icon = icon;
        this.title = title;
        this.action = action;
        this.classes = classes.join(' ');
        this.sort = sort;
        this._template = template;
    }

    get template(): string {
        return this._template || null;
    }
}