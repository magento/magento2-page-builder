define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /*eslint-disable */
  var AlignTop =
  /*#__PURE__*/
  function () {
    function AlignTop() {}

    var _proto = AlignTop.prototype;

    /**
     * Apply align top appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    _proto.add = function add(data) {
      data['align_self'] = 'flex-start';
      return data;
    };

    return AlignTop;
  }();

  return AlignTop;
});
//# sourceMappingURL=align-top.js.map
