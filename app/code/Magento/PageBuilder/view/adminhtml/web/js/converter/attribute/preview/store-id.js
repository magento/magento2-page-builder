/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var CreateValueForStoreId =
  /*#__PURE__*/
  function () {
    "use strict";

    function CreateValueForStoreId() {}

    var _proto = CreateValueForStoreId.prototype;

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
      if (typeof data[name] !== "string") {
        return "";
      }

      return data[name].replace(/\}\}$/, " store_id=\"0\"}}");
    };

    return CreateValueForStoreId;
  }();

  return CreateValueForStoreId;
});
//# sourceMappingURL=store-id.js.map
