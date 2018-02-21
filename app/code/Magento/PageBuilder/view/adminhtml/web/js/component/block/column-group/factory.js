/*eslint-disable */
define(["../../config", "../factory"], function (_config, _factory) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a column and add it to it's parent
   *
   * @param {ColumnGroup} parent
   * @param {number} width
   * @param {number} index
   * @returns {Promise<Column>}
   */
  function createColumn(parent, width, index) {
    return (0, _factory)(_config.getContentType("column"), parent, parent.stage, {
      width: parseFloat(width.toString()) + "%"
    }).then(function (column) {
      parent.addChild(column, index);
      return column;
    });
  }

  return {
    createColumn: createColumn
  };
});
//# sourceMappingURL=factory.js.map
