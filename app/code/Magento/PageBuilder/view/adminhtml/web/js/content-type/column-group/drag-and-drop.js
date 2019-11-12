/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Calculate the drop positions of a column group
   *
   * @param {ContentTypeCollectionInterface} group
   * @returns {any[]}
   */
  function calculateDropPositions(group) {
    var resizeUtils = group.preview.getResizeUtils();
    var dropPositions = [];
    group.children().forEach(function (column, index) {
      var left = column.preview.element.position().left;
      var width = column.preview.element.outerWidth(true);
      var canShrink = resizeUtils.getAcceptedColumnWidth(resizeUtils.getColumnWidth(column).toString()) > resizeUtils.getSmallestColumnWidth();
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
//# sourceMappingURL=drag-and-drop.js.map