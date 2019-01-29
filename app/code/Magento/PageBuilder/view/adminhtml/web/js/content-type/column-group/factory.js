/*eslint-disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory"], function (_config, _contentTypeFactory) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a column and add it to it's parent
   *
   * @param {ContentTypeCollectionInterface} parent
   * @param {number} width
   * @param {number} index
   * @returns {Promise<ContentTypeCollectionInterface>}
   */
  function createColumn(parent, width, index) {
    return (0, _contentTypeFactory)(_config.getContentTypeConfig("column"), parent, parent.stageId, {
      width: parseFloat(width.toString()) + "%"
    }).then(function (column) {
      parent.addChild(column, index);
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
