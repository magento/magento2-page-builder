import EventEmitter from "../../../event-emitter";
import ko from 'knockout';

/**
 * Block Class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Block extends EventEmitter {
    config: ContentBlockConfig;
    code: KnockoutObservable<string> = ko.observable('');
    name: KnockoutObservable<string> = ko.observable('');
    icon: KnockoutObservable<string> = ko.observable('');
    droppable: boolean = true;

    /**
     * Block constructor
     *
     * @param config
     */
    constructor(config: ContentBlockConfig) {
        super();
        this.config = config;
        this.code(config.code);
        this.name(config.name);
        this.icon(config.icon);
    }
}