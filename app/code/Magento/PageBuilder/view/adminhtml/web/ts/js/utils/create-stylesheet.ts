/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {StyleBlock, StyleBlocks} from "./style-blocks";

/**
 * Create a stylesheet DOM object from a style block declaration
 *
 * @param {StyleBlocks} blocks
 * @returns {HTMLStyleElement}
 * @api
 */
export function createStyleSheet(blocks: StyleBlocks) {
    const style = document.createElement("style");
    const text = Object.keys(blocks).map((selector) => {
        return selector + ` {\n${processDeclarationBlock(blocks[selector])}\n}`;
    }).join("\n");

    style.setAttribute("type", "text/css");
    style.appendChild(document.createTextNode(text));

    return style;
}

/**
 * Process a declaration block from the rule set
 *
 * @param {StyleBlock} block
 * @returns {string}
 */
function processDeclarationBlock(block: StyleBlock) {
    return Object.keys(block).map((property) => {
        return processDeclaration(property, block[property]);
    }).join("\n");
}

/**
 * Process a declaration, creating the property: value syntax
 *
 * @param {string} property
 * @param {string | number} value
 * @returns {string}
 */
function processDeclaration(property: string, value: string | number) {
    return hyphenate(property) + `: ${value};`;
}

/**
 * Hyphenate style property, from textAlign to text-align
 *
 * @param {string} property
 * @returns {string}
 */
function hyphenate(property: string) {
    return property.replace(/[A-Z]/g, (match) => {
        return `-${match.toLowerCase()}`;
    });
}
