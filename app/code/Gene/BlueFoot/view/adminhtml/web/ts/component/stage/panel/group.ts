import ko from 'knockout';

/**
 * Group Class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Group {
    id: KnockoutObservable<number> = ko.observable();
    code: KnockoutObservable<string> = ko.observable('');
    label: KnockoutObservable<string> = ko.observable('');
    icon: KnockoutObservable<string> = ko.observable('');
    sort: KnockoutObservable<number> = ko.observable();
    blocks: KnockoutObservableArray<Array<any>> = ko.observableArray([]);
    active: KnockoutObservable<boolean> = ko.observable(false);
    hidden: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * Group constructor
     *
     * @param id
     * @param group
     * @param blocks
     *
     * @todo change group type
     */
    constructor(id: number, group: any, blocks: Array<any> = []) {
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
    toggle() {
        this.active(!this.active());
    }
}