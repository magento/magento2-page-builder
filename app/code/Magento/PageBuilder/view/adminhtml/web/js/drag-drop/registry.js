/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var draggedContentTypeConfig;
  /**
   * Set the current dragged blocks config into the registry
   *
   * @param {ContentTypeConfigInterface} config
   */

  function setDraggedContentTypeConfig(config) {
    draggedContentTypeConfig = config;
  }
  /**
   * Retrieve the dragged blocks config
   *
   * @returns {ContentTypeConfigInterface}
   */


  function getDraggedContentTypeConfig() {
    return draggedContentTypeConfig;
  }

  return {
    setDraggedContentTypeConfig: setDraggedContentTypeConfig,
    getDraggedContentTypeConfig: getDraggedContentTypeConfig
  };
});
//# sourceMappingURL=registry.js.map