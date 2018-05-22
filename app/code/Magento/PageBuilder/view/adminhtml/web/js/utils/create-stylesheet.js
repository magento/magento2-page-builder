/*eslint-disable */
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
   */
  function createStyleSheet(blocks) {
    var style = document.createElement("style");
    var text = Object.keys(blocks).map(function (selector) {
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


  function processRuleSet(selector, block) {
    return selector + (" {\n" + processDeclarationBlock(block) + "\n}");
  }
  /**
   * Process a declaration block from the rule set
   *
   * @param {StyleBlock} block
   * @returns {string}
   */


  function processDeclarationBlock(block) {
    return Object.keys(block).map(function (prop) {
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


  function processDeclaration(prop, value) {
    return hyphenate(prop) + (": " + value + ";");
  }
  /**
   * Hyphenate style properties, from textAlign to text-align
   *
   * @param {string} prop
   * @returns {string}
   */


  function hyphenate(prop) {
    return prop.replace(/[A-Z]/g, function (match) {
      return "-" + match.toLowerCase();
    });
  }

  return {
    createStyleSheet: createStyleSheet
  };
});
//# sourceMappingURL=create-stylesheet.js.map
