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
 */
export function createStyleSheet(blocks: StyleBlocks) {
    const style = document.createElement("style");
    const text = Object.keys(blocks).map((selector) => {
        return processRuleSet(selector, blocks[selector]);
    }).join("\n");

    style.setAttribute("type", "text/css");
    style.appendChild(document.createTextNode(text));

    return style;
}

/**
 * Process an individual rule set
 *
 * @param {string} selector
 * @param {StyleBlock} block
 * @returns {string}
 */
function processRuleSet(selector: string, block: StyleBlock) {
    return selector + ` {\n${processDeclarationBlock(block)}\n}`;
}

/**
 * Process a declaration block from the rule set
 *
 * @param {StyleBlock} block
 * @returns {string}
 */
function processDeclarationBlock(block: StyleBlock) {
    return Object.keys(block).map((prop) => {
        return processDeclaration(prop, block[prop]);
    }).join("\n");
}

/**
 * Process a declaration, creating the property: value syntax
 *
 * @param {string} prop
 * @param {string | number} value
 * @returns {string}
 */
function processDeclaration(prop: string, value: string | number) {
    return hyphenate(prop) + `: ${value};`;
}

/**
 * Hyphenate style properties, from textAlign to text-align
 *
 * @param {string} prop
 * @returns {string}
 */
function hyphenate(prop: string) {
    return prop.replace(/[A-Z]/g, (match) => {
        return `-${match.toLowerCase()}`;
    });
}
