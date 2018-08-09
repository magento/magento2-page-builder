import Preview from "../content-type/preview";

/**
 * @api
 */
export default interface OptionConfigInterface {
    parent: Preview;
    code?: string;
    icon?: string;
    title: string;
    action?: () => void;
    classes?: string[];
    sort?: number;
    optionTemplate?: string;
}
