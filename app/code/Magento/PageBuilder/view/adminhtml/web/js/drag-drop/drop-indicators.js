/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/create-stylesheet", "Magento_PageBuilder/js/drag-drop/matrix"], function (_createStylesheet, _matrix) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var headDropIndicatorStyles;
  /**
   * Show the drop indicators for a specific content type
   *
   * We do this by creating a style sheet and injecting it into the head. It's dramatically quicker to allow the browsers
   * CSS engine to display these for us than manually iterating through the DOM and applying a class to the elements.
   *
   * @param {string} contentType
   * @param {string} stageId
   * @returns {HTMLStyleElement}
   */

  function showDropIndicators(contentType, stageId) {
    var acceptedContainers = (0, _matrix.getContainersFor)(contentType);

    if (acceptedContainers.length > 0) {
      var _ref;

      var classNames = acceptedContainers.map(function (container) {
        return "#" + stageId + " .content-type-container." + container + "-container > .pagebuilder-drop-indicator, " + ("#" + stageId + " .pagebuilder-content-type.type-container.empty-container > .content-type-container.") + (container + "-container:before");
      });
      var styles = (0, _createStylesheet.createStyleSheet)((_ref = {}, _ref[classNames.join(", ")] = {
        opacity: 1,
        visibility: "visible"
      }, _ref));
      document.head.appendChild(styles);
      headDropIndicatorStyles = styles;
      return styles;
    }
  }
  /**
   * Hide the drop indicators
   */


  function hideDropIndicators() {
    if (headDropIndicatorStyles) {
      headDropIndicatorStyles.remove();
      headDropIndicatorStyles = null;
    }
  }

  return {
    showDropIndicators: showDropIndicators,
    hideDropIndicators: hideDropIndicators
  };
});
//# sourceMappingURL=drop-indicators.js.map