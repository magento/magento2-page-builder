/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import {fromSnakeToCamelCase} from "../utils/string";
import StylePropertyReaderInterface from "./style-property-reader-interface.types";

/**
 * @api
 */
export default class StylePropertyReader implements StylePropertyReaderInterface {
    /**
     * Read styles for the element
     *
     * @param element
     * @param source
     * @param styles
     */
    public read(element: HTMLElement, source: string, styles: CSSStyleDeclaration[]): string | object {
        if (!styles || !styles.length) {
            return "";
        }

        let styleValue = "";
        styles.forEach((style) => {
            const value = style.getPropertyValue(source.replace("_", "-"));
            if (!_.isEmpty(value)) {
                styleValue = value;
            }
        });
        return styleValue;
    }
}
