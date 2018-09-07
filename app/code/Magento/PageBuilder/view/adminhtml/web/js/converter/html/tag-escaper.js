/*eslint-disable */
define(["underscore"], function (_underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var TagEscaper =
  /*#__PURE__*/
  function () {
    function TagEscaper() {}

    var _proto = TagEscaper.prototype;

    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return (0, _underscore.unescape)(value);
    };
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      return (0, _underscore.escape)(data[name].toString());
    };

    return TagEscaper;
  }();

  return TagEscaper;
});
//# sourceMappingURL=tag-escaper.js.map
