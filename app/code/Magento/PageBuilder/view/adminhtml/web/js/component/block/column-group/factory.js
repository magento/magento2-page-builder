/*eslint-disable */
define(["Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/config"], function (_contentTypeFactory, _config) {
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
    return (0, _contentTypeFactory)(_config.getContentTypeConfig("column"), parent, parent.stageId, {
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
