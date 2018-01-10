/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";

export class Group {
    public id: KnockoutObservable<number> = ko.observable();
    public code: KnockoutObservable<string> = ko.observable("");
    public label: KnockoutObservable<string> = ko.observable("");
    public icon: KnockoutObservable<string> = ko.observable("");
    public sort: KnockoutObservable<number> = ko.observable();
    public blocks: KnockoutObservableArray<[any]> = ko.observableArray([]);
    public active: KnockoutObservable<boolean> = ko.observable(false);
    public hidden: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * Group constructor
     *
     * @param id
     * @param group
     * @param blocks
     *
     * @todo change group type
     */
    constructor(id: number, group: any, blocks: any[] = []) {
        this.id(id);
        this.code(group.code);
        this.label(group.label);
        this.icon(group.icon);
        this.sort(group.sort);
        this.blocks(blocks);
    }

    /**
     * Toggle the group
     */
    public toggle() {
        this.active(!this.active());
    }
}
