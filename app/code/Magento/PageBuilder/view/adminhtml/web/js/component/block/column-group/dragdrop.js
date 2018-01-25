/*eslint-disable */
define(["../../config", "../factory", "./resizing"], function (_config, _factory, _resizing) {
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
  /**
   * Create a column and add it to it's parent
   *
   * @param {ColumnGroup} parent
   * @param {number} width
   * @param {number} index
   * @returns {Promise<void>}
   */


  function createColumn(parent, width, index) {
    return (0, _factory)(_config.getContentTypeConfig("column"), parent, parent.stage, {
      width: parseFloat(width.toString()) + "%"
    }).then(function (column) {
      parent.addChild(column, index);
      return column;
    });
  }

  return {
    calculateDropPositions: calculateDropPositions,
    createColumn: createColumn
  };
});
//# sourceMappingURL=dragdrop.js.map
