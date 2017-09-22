import Block from "../block";
import _ from "underscore";
import ko from "knockout";

/**
 * PreviewBlock class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class PreviewBlock {
    template: string = '';
    parent: Block;
    config: any;

    constructor(parent: Block, config: object) {
        this.parent = parent;
        this.config = config;

        if (typeof this.config.preview_template !== 'undefined' && this.config.preview_template) {
            this.template = this.config.preview_template;
        }

        this.setupFields();
    }

    /**
     * Create each individuall field as an observable on the class
     */
    setupFields() {
        _.forEach(this.config.fields_list, function (field: string) {
            this[field] = ko.observable();
        }.bind(this));
    }
}