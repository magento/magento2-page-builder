import EventEmitter from "../../../event-emitter";
import ko from 'knockout';

/**
 * Block Class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Block extends EventEmitter {
    config: ContentBlockConfig;
    identifier: KnockoutObservable<string> = ko.observable('');
    label: KnockoutObservable<string> = ko.observable('');
    icon: KnockoutObservable<string> = ko.observable('');
    droppable: boolean = true;

    /**
     * Block Constructor
     *
     * @param {string} identifier
     * @param {ContentBlockConfig} config
     */
    constructor(identifier: string, config: ContentBlockConfig) {
        super();
        this.config = config;
        this.identifier(identifier);
        this.label(config.label);
        this.icon(config.icon);
    }

    getDraggableConfig() {
        return this.config.allowed_children.map(function(value, index) {return '.' + value + '-container'}).join(', ');
    }
}