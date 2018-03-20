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

    _proto.fromDom = function fromDom(name, value) {
      var _name$split = name.split('_'),
          type = _name$split[0],
          direction = _name$split[1];

      var result = {};
      result[type] = {};
      result[type][direction] = value.replace('px', '');
      return result;
    };

    _proto.toDom = function toDom(name, data) {
      var parts = name.split("_");
      var value = data[name];

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
