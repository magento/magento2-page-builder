import * as _ from 'underscore';
/**
 * Options Class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Options {
    /**
     * Options constructor
     *
     * @param parent
     * @param options
     */
    constructor(parent, options) {
        this.options = ko.observableArray([]);
        this.template = 'Gene_BlueFoot/component/stage/structural/options.html';
        this.parent = parent;
        this.options = this.options.concat(options);
        this.sort();
    }
    /**
     * Sort the options
     */
    sort() {
        this.options.sort(function (a, b) {
            return a.sort === b.sort ? 0 : (a.sort < b.sort ? -1 : 1);
        });
    }
    /**
     * Add an option into the options array
     *
     * @param option
     */
    addOption(option) {
        this.options.push(option);
        this.sort();
    }
    /**
     * Remove an option
     *
     * @param code
     */
    removeOption(code) {
        this.options(_.without(this.options(), _.findWhere(this.options(), {
            code: code
        })));
        this.sort();
    }
    /**
     * Retrieve the template
     *
     * @deprecated
     * @returns {string}
     */
    getTemplate() {
        return this.template;
    }
}
