/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import { fromCamelCaseToDash } from "../utils/string";

const styleRegistries: Record<string, StyleRegistry> = {};

export type Styles = Record<string, Style>;
export type Style = Record<string, any>;
export const pbStyleAttribute: string = "data-pb-style";
export const styleDataAttribute: string = "data-style-id";

export default class StyleRegistry {
    private styles: Record<string, Style> = {};

    constructor(identifier?: string) {
        if (identifier) {
            styleRegistries[identifier] = this;
        }
    }

    /**
     * Update styles for selector
     *
     * @param selector
     * @param styles
     */
    public setStyles(selector: string, styles: Style): void {
        this.styles[selector] = styles;
    }

    /**
     * Retrieve styles for a selector
     *
     * @param selector
     */
    public getStyles(selector: string): Style {
        if (this.styles[selector]) {
            return this.styles[selector];
        }

        return {};
    }

    /**
     * Retrieve all styles
     */
    public getAllStyles(): Styles {
        return this.styles;
    }
}

/**
 * Return the style registry
 *
 * @param id
 */
export function getStyleRegistry(id: string): StyleRegistry {
    return styleRegistries[id] !== undefined ? styleRegistries[id] : null;
}

/**
 * Delete the style registry
 *
 * @param id
 */
export function deleteStyleRegistry(id: string): void {
    if (styleRegistries[id]) {
        delete styleRegistries[id];
    }
}

/**
 * Generate CSS from styles
 *
 * @param styles
 */
export function generateCss(styles: Styles) {
    let generatedCss = "";
    Object.keys(styles).forEach((selector: string) => {
        if (!_.isEmpty(styles[selector])) {
            generatedCss += generateCssBlock(selector, styles[selector]);
        }
    });
    return generatedCss;
}

/**
 * Generate styles from an object
 *
 * @param selector
 * @param styles
 */
export function generateCssBlock(selector: string, styles: Style) {
    let generatedStyles = "";

    Object.keys(styles).forEach((key: string) => {
        if (!_.isEmpty(styles[key])) {
            generatedStyles += `${fromCamelCaseToDash(key)}: ${styles[key]}; `;
        }
    });

    return `${selector} { ${generatedStyles} }`;
}
