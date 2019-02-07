/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";

export class Menu {
    public hidden: KnockoutObservable<boolean> = ko.observable(false);
    public id: KnockoutObservable<number> = ko.observable();
    public code: KnockoutObservable<string> = ko.observable("");
    public label: KnockoutObservable<string> = ko.observable("");
    public icon: KnockoutObservable<string> = ko.observable("");
    public sort: KnockoutObservable<number> = ko.observable();
    public contentTypes: KnockoutObservableArray<[any]> = ko.observableArray([]);
    public active: KnockoutObservable<boolean> = ko.observable(false);
    public stageId: string;

    /**
     * Menu constructor
     *
     * @param id
     * @param menu
     * @param contentTypes
     * @param stageId
     */
    constructor(id: number, menu: any, contentTypes: any[] = [], stageId: string) {
        this.id(id);
        this.code(menu.code);
        this.label(menu.label);
        this.icon(menu.icon);
        this.sort(menu.sort);
        this.contentTypes(contentTypes);
        this.stageId = stageId;
    }

    /**
     * Toggle the menu
     */
    public toggle() {
        this.active(!this.active());
    }
}
