/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var FullHeight =
  /*#__PURE__*/
  function () {
    function FullHeight() {}

    var _proto = FullHeight.prototype;

    /**
     * Apply full height appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    _proto.add = function add(data) {
      data.align_self = "stretch";
      return data;
    };

    return FullHeight;
  }();

  return FullHeight;
});
//# sourceMappingURL=full-height.js.map
