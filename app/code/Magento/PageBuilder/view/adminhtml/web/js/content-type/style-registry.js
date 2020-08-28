/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/utils/string"], function (_underscore, _string) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var styleRegistries = {};
  var pbStyleAttribute = "data-pb-style";
  var styleDataAttribute = "data-style-id";

  var StyleRegistry =
  /*#__PURE__*/
  function () {
    "use strict";

    function StyleRegistry(identifier) {
      this.styles = {};

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


    var _proto = StyleRegistry.prototype;

    _proto.setStyles = function setStyles(selector, styles) {
      this.styles[selector] = styles;
    }
    /**
     * Retrieve styles for a selector
     *
     * @param selector
     */
    ;

    _proto.getStyles = function getStyles(selector) {
      if (this.styles[selector]) {
        return this.styles[selector];
      }

      return {};
    }
    /**
     * Retrieve all styles
     */
    ;

    _proto.getAllStyles = function getAllStyles() {
      return this.styles;
    };

    return StyleRegistry;
  }();
  /**
   * Return the style registry
   *
   * @param id
   */


  function getStyleRegistry(id) {
    return styleRegistries[id] !== undefined ? styleRegistries[id] : null;
  }
  /**
   * Delete the style registry
   *
   * @param id
   */


  function deleteStyleRegistry(id) {
    if (styleRegistries[id]) {
      delete styleRegistries[id];
    }
  }
  /**
   * Generate CSS from styles
   *
   * @param styles
   */


  function generateCss(styles) {
    var generatedCss = "";
    Object.keys(styles).forEach(function (selector) {
      if (!_underscore.isEmpty(styles[selector])) {
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


  function generateCssBlock(selector, styles) {
    var generatedStyles = "";
    Object.keys(styles).forEach(function (key) {
      if (!_underscore.isEmpty(styles[key])) {
        generatedStyles += (0, _string.fromCamelCaseToDash)(key) + ": " + styles[key] + "; ";
      }
    });
    return selector + " { " + generatedStyles + " }";
  }

  return Object.assign(StyleRegistry, {
    getStyleRegistry: getStyleRegistry,
    deleteStyleRegistry: deleteStyleRegistry,
    generateCss: generateCss,
    generateCssBlock: generateCssBlock,
    pbStyleAttribute: pbStyleAttribute,
    styleDataAttribute: styleDataAttribute
  });
});
//# sourceMappingURL=style-registry.js.map