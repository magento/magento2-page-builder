define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AlignBottom =
  /*#__PURE__*/
  function () {
    function AlignBottom() {}

    var _proto = AlignBottom.prototype;

    /**
     * Apply align bottom appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    _proto.add = function add(data) {
      data['align_self'] = 'flex-end';
      return data;
    };

    return AlignBottom;
  }();

  return AlignBottom;
});
//# sourceMappingURL=align-bottom.js.map
