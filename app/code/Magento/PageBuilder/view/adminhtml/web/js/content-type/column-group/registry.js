/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var dragColumn;
  /**
   * Retrieve the drag column from the registry
   *
   * @returns {ContentTypeCollectionInterface}
   */

  function getDragColumn() {
    return dragColumn;
  }
  /**
   * Remove the drag column reference
   */


  function removeDragColumn() {
    dragColumn = null;
  }
  /**
   * Set the drag column in the registry
   *
   * @param {ContentTypeCollectionInterface<ColumnPreview>} column
   */


  function setDragColumn(column) {
    dragColumn = column;
  }

  return {
    getDragColumn: getDragColumn,
    removeDragColumn: removeDragColumn,
    setDragColumn: setDragColumn
  };
});
//# sourceMappingURL=registry.js.map