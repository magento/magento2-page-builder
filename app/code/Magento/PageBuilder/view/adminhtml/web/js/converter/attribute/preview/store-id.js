/*eslint-disable */
/* jscs:disable */
define(["jquery"], function (_jquery) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var StoreId =
  /*#__PURE__*/
  function () {
    "use strict";

    function StoreId() {}

    var _proto = StoreId.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    }
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      if (typeof data[name] !== "string") {
        return "";
      }

      var storeId = (0, _jquery)('[data-role="store-view-id"]').val() || "0";
      return data[name].replace(/}}$/, " store_id=\"" + storeId + "\"}}");
    };

    return StoreId;
  }();

  return StoreId;
});
//# sourceMappingURL=store-id.js.map