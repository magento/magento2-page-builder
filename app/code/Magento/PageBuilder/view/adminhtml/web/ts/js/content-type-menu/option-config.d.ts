import Preview from "../content-type/preview";

/**
 * @api
 */
export default interface OptionConfigInterface {
    preview: Preview;
    code?: string;
    icon?: string;
    title: string;
    action?: () => void;
    classes?: string[];
    sort?: number;
    template?: string;
}
