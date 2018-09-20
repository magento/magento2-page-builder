/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var CreateValueForHref =
  /*#__PURE__*/
  function () {
    function CreateValueForHref() {}

    var _proto = CreateValueForHref.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      var link = data[name];
      var href = "";

      if (!link) {
        return href;
      }

      var linkType = link.type;

      if (link[linkType]) {
        if (link[linkType] === "javascript:void(0)") {
          link[linkType] = "";
        }

        href = link[linkType];
      }

      return href;
    };

    return CreateValueForHref;
  }();

  return CreateValueForHref;
});
//# sourceMappingURL=link-href.js.map
