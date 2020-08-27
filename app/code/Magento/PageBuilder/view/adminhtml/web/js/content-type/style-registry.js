/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/utils/string"], function (_underscore, _string) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var styleRegistries = {};

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
     * Update styles for className
     *
     * @param className
     * @param styles
     */


    var _proto = StyleRegistry.prototype;

    _proto.setStyles = function setStyles(className, styles) {
      this.styles[className] = styles;
    }
    /**
     * Retrieve styles for a class name
     *
     * @param className
     */
    ;

    _proto.getStyles = function getStyles(className) {
      if (this.styles[className]) {
        return this.styles[className];
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
    Object.keys(styles).forEach(function (className) {
      if (!_underscore.isEmpty(styles[className])) {
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


  function generateCssBlock(className, styles) {
    var generatedStyles = "";
    Object.keys(styles).forEach(function (key) {
      if (!_underscore.isEmpty(styles[key])) {
        generatedStyles += (0, _string.fromCamelCaseToSnake)(key) + ": " + styles[key] + "; ";
      }
    });
    return "." + className + " { " + generatedStyles + " }";
  }

  return Object.assign(StyleRegistry, {
    getStyleRegistry: getStyleRegistry,
    deleteStyleRegistry: deleteStyleRegistry,
    generateCss: generateCss,
    generateCssBlock: generateCssBlock
  });
});
//# sourceMappingURL=style-registry.js.map