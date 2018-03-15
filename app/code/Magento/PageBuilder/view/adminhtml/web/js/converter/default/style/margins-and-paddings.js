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

    _proto.fromDom = function fromDom(value, key, data) {
      var _key$split = key.split('_'),
          type = _key$split[0],
          direction = _key$split[1];

      var result = {};
      result[type] = {};
      result[type][direction] = value.replace('px', '');
      return result;
    };

    _proto.toDom = function toDom(value, key, data) {
      var parts = key.split("_");

      if (typeof value === "string" && value !== "") {
        value = JSON.parse(value);
      }

      return value !== undefined && value[parts[0]] !== undefined && value[parts[0]][parts[1]] !== undefined ? value[parts[0]][parts[1]] + "px" : null;
    };

    return MarginsAndPaddings;
  }();

  return MarginsAndPaddings;
});
//# sourceMappingURL=margins-and-paddings.js.map
