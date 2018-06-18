/*eslint-disable */
define(["Magento_PageBuilder/js/content-type/column-group/resizing"], function (_resizing) {
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
    var columnGroupUtils = new _resizing(group);
    var dropPositions = [];
    group.children().forEach(function (column, index) {
      var left = column.preview.element.position().left;
      var width = column.preview.element.outerWidth(true);
      var canShrink = columnGroupUtils.getAcceptedColumnWidth(columnGroupUtils.getColumnWidth(column).toString()) > columnGroupUtils.getSmallestColumnWidth();
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
