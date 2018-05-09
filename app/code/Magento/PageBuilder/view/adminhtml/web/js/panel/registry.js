/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var draggedBlockConfig;

  function setDraggedBlockConfig(config) {
    draggedBlockConfig = config;
  }

  function getDraggedBlockConfig() {
    return draggedBlockConfig;
  }

  return {
    setDraggedBlockConfig: setDraggedBlockConfig,
    getDraggedBlockConfig: getDraggedBlockConfig
  };
});
//# sourceMappingURL=registry.js.map
