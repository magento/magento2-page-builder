/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";

export class Group {
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
     * Group constructor
     *
     * @param id
     * @param group
     * @param contentTypes
     * @param stageId
     */
    constructor(id: number, group: any, contentTypes: any[] = [], stageId: string) {
        this.id(id);
        this.code(group.code);
        this.label(group.label);
        this.icon(group.icon);
        this.sort(group.sort);
        this.contentTypes(contentTypes);
        this.stageId = stageId;
    }

    /**
     * Toggle the group
     */
    public toggle() {
        this.active(!this.active());
    }
}
