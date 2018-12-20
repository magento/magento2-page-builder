/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";

export class Group {
    private hidden: KnockoutObservable<boolean> = ko.observable(false);
    private id: KnockoutObservable<number> = ko.observable();
    private code: KnockoutObservable<string> = ko.observable("");
    private label: KnockoutObservable<string> = ko.observable("");
    private icon: KnockoutObservable<string> = ko.observable("");
    private sort: KnockoutObservable<number> = ko.observable();
    private contentTypes: KnockoutObservableArray<[any]> = ko.observableArray([]);
    private active: KnockoutObservable<boolean> = ko.observable(false);
    private stageId: string;

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
