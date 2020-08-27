/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import { fromCamelCaseToSnake } from "../utils/string";

const styleRegistries: Record<string, StyleRegistry> = {};

export type Styles = Record<string, Style>;
export type Style = Record<string, any>;

export default class StyleRegistry {
    private styles: Record<string, Style> = {};

    constructor(identifier?: string) {
        if (identifier) {
            styleRegistries[identifier] = this;
        }
    }

    /**
     * Update styles for className
     *
     * @param className
     * @param styles
     */
    public setStyles(className: string, styles: Style): void {
        this.styles[className] = styles;
    }

    /**
     * Retrieve styles for a class name
     *
     * @param className
     */
    public getStyles(className: string): Style {
        if (this.styles[className]) {
            return this.styles[className];
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
    Object.keys(styles).forEach((className: string) => {
        if (!_.isEmpty(styles[className])) {
            generatedCss += generateCssBlock(className, styles[className]);
        }
    });
    return generatedCss;
}

/**
 * Generate styles from an object
 *
 * @param className
 * @param styles
 */
export function generateCssBlock(className: string, styles: Style) {
    let generatedStyles = "";
    Object.keys(styles).forEach((key: string) => {
        if (!_.isEmpty(styles[key])) {
            generatedStyles += `${fromCamelCaseToSnake(key)}: ${styles[key]}; `;
        }
    });
    return `.${className} { ${generatedStyles} }`;
}
