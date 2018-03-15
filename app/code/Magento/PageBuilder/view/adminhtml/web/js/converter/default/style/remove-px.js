/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var RemovePx =
  /*#__PURE__*/
  function () {
    function RemovePx() {}

    var _proto = RemovePx.prototype;

    _proto.fromDom = function fromDom(value, key, data) {
      return value.replace("px", "");
    };

    _proto.toDom = function toDom(value, key, data) {
      return value + 'px';
    };

    return RemovePx;
  }();

  return RemovePx;
});
//# sourceMappingURL=remove-px.js.map
