/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import text from "mage/requirejs/text";
import {loadTemplate} from "../frame";

/**
 * Within our render frame we override the RequireJS text! plugin, this is originally implemented within
 * lib/web/mage/requirejs/text.js. The override uses the MessageChannel to communicate with the parent frame to
 * retrieve any requested HTML knockout template. We do this due to the sandbox restrictions on the iframe disallow
 * XHR requests to the same origin domain.
 */

/**
 * Load a template
 *
 * @param name
 * @param req
 * @param onLoad
 */
export function load(
    name: string, req: () => {},
    onLoad: {(template: string): {}, error: (error: string) => {}},
): void {
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
