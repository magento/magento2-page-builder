/*eslint-disable */
define(["Magento_PageBuilder/js/component/block/preview/column-group/resizing"], function (_resizing) {
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
    } // Also shrink the closest shrinkable column


    var allowedToShrink = true;

    if (difference && shrinkableColumn) {
      var currentShrinkable = (0, _resizing.getColumnWidth)(shrinkableColumn);
      var shrinkableSize = (0, _resizing.getAcceptedColumnWidth)((currentShrinkable + -difference).toString()); // Ensure the column we're crushing is not becoming the same size, and it's not less than the smallest width

      if (currentShrinkable === parseFloat(shrinkableSize.toString()) || parseFloat(shrinkableSize.toString()) < (0, _resizing.getSmallestColumnWidth)()) {
        allowedToShrink = false;
      } else {
        updateColumnWidth(shrinkableColumn, shrinkableSize);
      }
    }

    if (allowedToShrink) {
      updateColumnWidth(column, width);
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
