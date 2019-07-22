/*eslint-disable */
define(["Magento_PageBuilder/js/events"], function (_events) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var styleRegistries = {};

  var StyleRegistry =
  /*#__PURE__*/
  function () {
    "use strict";

    function StyleRegistry(stageId) {
      this.styles = {};
      this.stageId = stageId;
      styleRegistries[stageId] = this;
    }
    /**
     * Update styles for className
     *
     * @param className
     * @param styles
     */


    var _proto = StyleRegistry.prototype;

    _proto.updateStyles = function updateStyles(className, styles) {
      this.styles[className] = styles;

      _events.trigger("styles:update", {
        className: className,
        styles: styles,
        stageId: this.stageId
      });
    }
    /**
     * Retrieve all styles
     */
    ;

    _proto.getStyles = function getStyles() {
      return this.styles;
    };

    return StyleRegistry;
  }();
  /**
   * Return the style registry for the current stage
   *
   * @param stageId
   */


  function getStyleRegistryForStage(stageId) {
    return styleRegistries[stageId] !== undefined ? styleRegistries[stageId] : null;
  }

  return Object.assign(StyleRegistry, {
    getStyleRegistryForStage: getStyleRegistryForStage
  });
});
//# sourceMappingURL=style-registry.js.map