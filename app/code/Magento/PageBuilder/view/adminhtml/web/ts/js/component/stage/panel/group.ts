/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";

export class Group {
    protected hidden: KnockoutObservable<boolean> = ko.observable(false);
    protected id: KnockoutObservable<number> = ko.observable();
    protected code: KnockoutObservable<string> = ko.observable("");
    protected label: KnockoutObservable<string> = ko.observable("");
    protected icon: KnockoutObservable<string> = ko.observable("");
    protected sort: KnockoutObservable<number> = ko.observable();
    protected blocks: KnockoutObservableArray<[any]> = ko.observableArray([]);
    protected active: KnockoutObservable<boolean> = ko.observable(false);

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
