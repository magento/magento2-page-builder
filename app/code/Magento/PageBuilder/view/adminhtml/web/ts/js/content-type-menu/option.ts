/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Preview from "../content-type/preview";
import OptionInterface from "./option.d";

export default class Option implements OptionInterface {
    public classes: KnockoutObservable<{[key: string]: boolean | KnockoutObservable<boolean>}> = ko.observable({});
    public code: string;
    public icon: KnockoutObservable<string> = ko.observable("");
    public parent: Preview;
    public sort: number;
    public title: KnockoutObservable<string> = ko.observable("");
    public action: () => void;
    public optionTemplate: string;
    public isDisabled: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * @param {Preview} parent
     * @param {string} code
     * @param {string} icon
     * @param {string} title
     * @param {() => void} action
     * @param {string[]} classes
     * @param {number} sort
     * @param {string} optionTemplate
     */
    constructor(
        parent: Preview,
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
        this.icon(icon);
        this.title(title);
        const koClasses: {[key: string]: boolean | KnockoutObservable<boolean>} = {};
        classes.forEach((cssClass) => {
            koClasses[cssClass] = true;
        });
        koClasses.disabled = this.isDisabled;
        this.classes(koClasses);
        this.sort = sort;
        this.optionTemplate = optionTemplate;

        this.setAction(action);
        this.bindEvents();
    }

    get template(): string {
        return this.optionTemplate || null;
    }

    /**
     * Set the action for the options menu
     *
     * @param {() => {}} action
     */
    public setAction(action: () => void): void {
        action = action ? action : () => { return; };
        this.action = (...args: any[]) => {
            if (!this.isDisabled()) {
                action.apply(this.parent, args);
            }
        };
    }

    /**
     * Bind events for the option menu item
     */
    public bindEvents() {
        // Bind any events required by the option menu item
        return;
    }
}
