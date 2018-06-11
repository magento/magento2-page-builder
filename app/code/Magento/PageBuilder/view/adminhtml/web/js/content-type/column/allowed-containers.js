/*eslint-disable */
define(["Magento_PageBuilder/js/interactions/sortable"], function (_sortable) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AllowedContainers =
  /*#__PURE__*/
  function () {
    function AllowedContainers() {}

    var _proto = AllowedContainers.prototype;

    /**
     * Set the column container to be allowed within other containers
     *
     * @param {string[]} allowedContainers
     */
    _proto.generate = function generate(allowedContainers) {
      allowedContainers = allowedContainers.concat((0, _sortable.getAllContainers)());
      return allowedContainers.filter(function (container) {
        return container !== "column";
      });
    };

    return AllowedContainers;
  }();

  return AllowedContainers;
});
//# sourceMappingURL=allowed-containers.js.map
