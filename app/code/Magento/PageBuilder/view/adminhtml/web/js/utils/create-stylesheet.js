/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a stylesheet DOM object from a style block declaration
   *
   * @param {StyleBlocks} blocks
   * @returns {HTMLStyleElement}
   * @api
   */
  function createStyleSheet(blocks) {
    var style = document.createElement("style");
    var text = Object.keys(blocks).map(function (selector) {
      return selector + (" {\n" + processDeclarationBlock(blocks[selector]) + "\n}");
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


  function processDeclarationBlock(block) {
    return Object.keys(block).map(function (property) {
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


  function processDeclaration(property, value) {
    return hyphenate(property) + (": " + value + ";");
  }
  /**
   * Hyphenate style property, from textAlign to text-align
   *
   * @param {string} property
   * @returns {string}
   */


  function hyphenate(property) {
    return property.replace(/[A-Z]/g, function (match) {
      return "-" + match.toLowerCase();
    });
  }

  return {
    createStyleSheet: createStyleSheet
  };
});
//# sourceMappingURL=create-stylesheet.js.map