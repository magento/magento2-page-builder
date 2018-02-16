/*eslint-disable */
define(["../preview/column-group/resizing"], function (_resizing) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Resize a column to a specific width
   *
   * @param {Column} column
   * @param {number} width
   * @param {Column} shrinkableColumn
   */
  function resizeColumn(column, width, shrinkableColumn) {
    var current = (0, _resizing.getColumnWidth)(column);
    var difference = (parseFloat(width.toString()) - current).toFixed(8); // Don't run the update if we've already modified the column

    if (current === parseFloat(width.toString()) || parseFloat(width.toString()) < (0, _resizing.getSmallestColumnWidth)()) {
      return;
    }

    updateColumnWidth(column, width); // Also shrink the closest shrinkable column

    if (difference && shrinkableColumn) {
      var currentShrinkable = (0, _resizing.getColumnWidth)(shrinkableColumn);
      var shrinkableSize = (0, _resizing.getAcceptedColumnWidth)((currentShrinkable + -difference).toString());
      updateColumnWidth(shrinkableColumn, shrinkableSize);
    }
  }
  /**
   * Update the width of a column
   *
   * @param {Column} column
   * @param {number} width
   */


  function updateColumnWidth(column, width) {
    column.stage.store.updateKey(column.id, parseFloat(width.toString()) + "%", "width");
  }

  return {
    resizeColumn: resizeColumn,
    updateColumnWidth: updateColumnWidth
  };
});
//# sourceMappingURL=resizing.js.map
