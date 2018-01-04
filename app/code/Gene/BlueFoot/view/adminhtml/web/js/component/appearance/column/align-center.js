define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /*eslint-disable */
  var AlignCenter =
  /*#__PURE__*/
  function () {
    function AlignCenter() {}

    var _proto = AlignCenter.prototype;

    /**
     * Apply align middle appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    _proto.add = function add(data) {
      data['align_self'] = 'center';
      return data;
    };

    return AlignCenter;
  }();

  return AlignCenter;
});
//# sourceMappingURL=align-center.js.map
