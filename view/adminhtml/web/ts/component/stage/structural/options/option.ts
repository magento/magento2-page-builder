import { Structural } from "../abstract.d";
import { OptionInterface } from "./option.d";

/**
 * Option Class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Option implements OptionInterface {
    parent: Structural;
    code: string;
    icon: string;
    title: string;
    action: Function | false = false;
    classes: string;
    sort: number;
    template?: string = null;

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
    constructor(
        parent: Structural,
        code: string,
        icon: string,
        title: string,
        action: Function | false,
        classes: Array<string>,
        sort: number,
        template?: string
    ) {
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
    getTemplate(): string {
        return this.template;
    }
}