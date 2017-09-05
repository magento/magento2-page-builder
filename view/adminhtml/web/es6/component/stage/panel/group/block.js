import EventEmitter from "../../../event-emitter";
import * as ko from 'knockout';
/**
 * Block Class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Block extends EventEmitter {
    /**
     * Block constructor
     *
     * @param config
     */
    constructor(config) {
        super();
        this.code = ko.observable('');
        this.name = ko.observable('');
        this.icon = ko.observable('');
        this.droppable = true;
        this.config = config;
        this.code(config.code);
        this.name(config.name);
        this.icon(config.icon);
    }
}
