/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "./property-reader-interface";
import {fromSnakeToCamelCase} from "../utils/string";

/**
 * @api
 */
export default class StylePropertyReader implements PropertyReaderInterface {
    /**
     * Read style property from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement, source: string): string | object {
        const camelCasedSource = fromSnakeToCamelCase(source);
        return element.style[<keyof CSSStyleDeclaration>camelCasedSource];
    }
}
