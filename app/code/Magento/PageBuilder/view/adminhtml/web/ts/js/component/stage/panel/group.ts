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
    private blocks: KnockoutObservableArray<[any]> = ko.observableArray([]);
    private active: KnockoutObservable<boolean> = ko.observable(false);

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
