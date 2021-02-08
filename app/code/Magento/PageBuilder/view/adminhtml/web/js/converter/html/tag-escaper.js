/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/utils/object"], function (_underscore, _object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var TagEscaper = /*#__PURE__*/function () {
    "use strict";

    function TagEscaper() {}

    var _proto = TagEscaper.prototype;

    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      var result = (0, _underscore.unescape)(value); // Have to do a manual &nbsp; replace since underscore un-escape does not un-escape &nbsp;

      return result.replace(/&nbsp;/g, String.fromCharCode(160));
    }
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      return (0, _underscore.escape)((0, _object.get)(data, name));
    };

    return TagEscaper;
  }();

  return TagEscaper;
});
//# sourceMappingURL=tag-escaper.js.map