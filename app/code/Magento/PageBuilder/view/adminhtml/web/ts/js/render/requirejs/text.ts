import text from "mage/requirejs/text";
import {loadTemplate} from "../frame";

/**
 * Load a template
 *
 * @param name
 * @param req
 * @param onLoad
 */
export function load(name: string, req: () => {}, onLoad: (template: string) => {}): void {
    loadTemplate(name).then((template) => {
        onLoad(template);
    }).catch((error) => {
        onLoad.error(error);
    });
}

/**
 * Retrieve a template
 *
 * @param url
 * @param callback
 * @param fail
 * @param headers
 */
export function get(url: string, callback: () => {}, fail: () => {}, headers: {}): void {
    text.get.apply(text, arguments);
}
