/*eslint-disable */
define(["./resizing"], function (_resizing) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Calculate the drop positions of a column group
   *
   * @param {ColumnGroup} group
   * @returns {any[]}
   */
  function calculateDropPositions(group) {
    var dropPositions = [];
    group.children().forEach(function (column, index) {
      var left = column.element.position().left;
      var width = column.element.outerWidth();
      var canShrink = (0, _resizing.getColumnWidth)(column) > (0, _resizing.getSmallestColumnWidth)();
      dropPositions.push({
        affectedColumn: column,
        canShrink: canShrink,
        insertIndex: index,
        left: left,
        placement: "left",
        right: left + width / 2
      }, {
        affectedColumn: column,
        canShrink: canShrink,
        insertIndex: index + 1,
        left: left + width / 2,
        placement: "right",
        right: left + width
      });
    });
    return dropPositions;
  }

  return {
    calculateDropPositions: calculateDropPositions
  };
});
//# sourceMappingURL=dragdrop.js.map
