/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/content-type-collection"], function (_contentTypeCollection) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Serialize the tree as a simplified object for rendering
   *
   * @param contentType
   */
  function buildTree(contentType) {
    var data = getData(contentType);
    var tree = {
      name: contentType.config.name,
      id: contentType.id,
      data: data,
      children: []
    };

    if (contentType instanceof _contentTypeCollection && contentType.getChildren()().length > 0) {
      contentType.getChildren()().forEach(function (child) {
        tree.children.push(buildTree(child));
      });
    }

    return tree;
  }
  /**
   * Get a serialized version of the tree
   *
   * @param contentType
   */


  function getSerializedTree(contentType) {
    return buildTree(contentType);
  }
  /**
   * Retrieve the master data from the content types instance
   *
   * @param contentType
   */


  function getData(contentType) {
    /**
     * Flip flop to JSON and back again to ensure all data is serializable. Magento by default adds functions into
     * some basic types which cannot be serialized when calling PostMessage.
     */
    return JSON.parse(JSON.stringify(contentType.dataStore.getState())) || {};
  }

  return {
    buildTree: buildTree,
    getSerializedTree: getSerializedTree
  };
});
//# sourceMappingURL=serialize.js.map