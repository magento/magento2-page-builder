/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {fromSnakeToCamelCase} from "../utils/string";
import PropertyReaderInterface from "./property-reader-interface";

/**
 * @api
 */
export default class StylePropertyReader implements PropertyReaderInterface {
    /**
     * Read style property from element
     *
     * @param {HTMLElement} element
     * @param {string} source
     * @returns {string | object}
     */
    public read(element: HTMLElement, source: string): string | object {
        const camelCasedSource = fromSnakeToCamelCase(source);
        return element.style[camelCasedSource as keyof CSSStyleDeclaration];
    }
}
