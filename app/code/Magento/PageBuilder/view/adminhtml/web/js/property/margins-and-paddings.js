/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MarginsAndPaddings =
  /*#__PURE__*/
  function () {
    function MarginsAndPaddings() {}

    var _proto = MarginsAndPaddings.prototype;

    _proto.read = function read(element) {
      return {
        margin: {
          left: "",
          top: "",
          right: "",
          bottom: ""
        },
        padding: {
          left: "",
          top: "",
          right: "",
          bottom: ""
        }
      };
    };

    _proto.write = function write() {};

    return MarginsAndPaddings;
  }();

  return MarginsAndPaddings;
});
//# sourceMappingURL=margins-and-paddings.js.map
