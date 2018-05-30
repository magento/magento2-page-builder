/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var draggedBlockConfig;
  /**
   * Set the current dragged blocks config into the registry
   *
   * @param {ContentTypeConfigInterface} config
   */

  function setDraggedBlockConfig(config) {
    draggedBlockConfig = config;
  }
  /**
   * Retrieve the dragged blocks config
   *
   * @returns {ContentTypeConfigInterface}
   */


  function getDraggedBlockConfig() {
    return draggedBlockConfig;
  }

  return {
    setDraggedBlockConfig: setDraggedBlockConfig,
    getDraggedBlockConfig: getDraggedBlockConfig
  };
});
//# sourceMappingURL=registry.js.map
