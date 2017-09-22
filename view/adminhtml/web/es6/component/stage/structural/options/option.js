/**
 * Option Class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Option {
    /**
     * Option constructor
     *
     * @param parent
     * @param code
     * @param icon
     * @param title
     * @param action
     * @param classes
     * @param sort
     * @param template
     */
    constructor(parent, code, icon, title, action, classes, sort, template) {
        this.action = false;
        this.template = null;
        this.parent = parent;
        this.code = code;
        this.icon = icon;
        this.title = title;
        this.action = action;
        this.classes = classes.join(' ');
        this.sort = sort;
        this.template = template;
    }
    /**
     * Return template for option
     *
     * @deprecated
     * @returns {string}
     */
    getTemplate() {
        return this.template;
    }
}
