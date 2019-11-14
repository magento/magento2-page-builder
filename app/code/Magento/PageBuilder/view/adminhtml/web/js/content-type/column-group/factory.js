/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory"], function (_config, _contentTypeFactory) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a column and add it to it's column group
   *
   * @param {ContentTypeCollectionInterface} columnGroup
   * @param {number} width
   * @param {number} index
   * @returns {Promise<ContentTypeCollectionInterface>}
   */
  function createColumn(columnGroup, width, index) {
    return (0, _contentTypeFactory)(_config.getContentTypeConfig("column"), columnGroup, columnGroup.stageId, {
      width: parseFloat(width.toString()) + "%"
    }).then(function (column) {
      columnGroup.addChild(column, index);
      return column;
    }).catch(function (error) {
      console.error(error);
      return null;
    });
  }

  return {
    createColumn: createColumn
  };
});
//# sourceMappingURL=factory.js.map