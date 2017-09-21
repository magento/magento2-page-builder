import ko from 'knockout';
/**
 * Group Class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Group {
    /**
     * Group constructor
     *
     * @param id
     * @param group
     * @param blocks
     *
     * @todo change group type
     */
    constructor(id, group, blocks = []) {
        this.id = ko.observable();
        this.code = ko.observable('');
        this.name = ko.observable('');
        this.icon = ko.observable('');
        this.sort = ko.observable();
        this.blocks = ko.observableArray([]);
        this.active = ko.observable(false);
        this.hidden = ko.observable(false);
        this.id(id);
        this.code(group.code);
        this.name(group.name);
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
