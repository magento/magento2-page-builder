/*eslint-disable */
define(["Magento_PageBuilder/js/content-type-collection", "Magento_PageBuilder/js/content-type/appearance-config"], function (_contentTypeCollection, _appearanceConfig) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Serailize the tree as a simplified object for rendering
   *
   * @param contentType
   */
  function buildTree(contentType) {
    var data = getMasterData(contentType);
    var tree = {
      template: getTemplate(contentType, data.appearance),
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
   * Retrieve the template for the content type \
   * @param contentType
   * @param appearance
   */


  function getTemplate(contentType, appearance) {
    return (0, _appearanceConfig)(contentType.config.name, appearance).master_template;
  }
  /**
   * Retrieve the master data from the content types instance
   *
   * @param contentType
   */


  function getMasterData(contentType) {
    return contentType.content.getBindings() || {};
  }

  return {
    buildTree: buildTree,
    getSerializedTree: getSerializedTree
  };
});
//# sourceMappingURL=serialize.js.map