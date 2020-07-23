/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/config"], function (_underscore, _config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var allowedParents = {};
  /**
   * Build a matrix of which containers each content type can go into, these are determined by the allowed_parents
   * node within the content types configuration
   */

  function generateAllowedParents() {
    _underscore.values(_config.getConfig("content_types")).forEach(function (contentType) {
      allowedParents[contentType.name] = contentType.allowed_parents.slice();
    });
  }
  /**
   * Retrieve the containers a specific content type can be contained in
   *
   * @param {string} contentType
   * @returns {any}
   */


  function getContainersFor(contentType) {
    if (allowedParents[contentType]) {
      return allowedParents[contentType];
    }

    return [];
  }
  /**
   * Generate classes of containers the content type is allowed within
   *
   * @param {string} contentType
   * @param {string} stageId
   * @returns {string}
   */


  function getAllowedContainersClasses(contentType, stageId) {
    return getContainersFor(contentType).map(function (value) {
      return "#" + stageId + " .content-type-container." + value + "-container";
    }).join(", ");
  }
  /**
   * @api
   */


  return {
    generateAllowedParents: generateAllowedParents,
    getContainersFor: getContainersFor,
    getAllowedContainersClasses: getAllowedContainersClasses
  };
});
//# sourceMappingURL=matrix.js.map