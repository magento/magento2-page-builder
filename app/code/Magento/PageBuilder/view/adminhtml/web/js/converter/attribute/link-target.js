/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var CreateValueForTarget =
  /*#__PURE__*/
  function () {
    function CreateValueForTarget() {}

    var _proto = CreateValueForTarget.prototype;

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
      if (!data[name]) {
        return "";
      }

      return data[name].setting ? "_blank" : "";
    };

    return CreateValueForTarget;
  }();

  return Object.assign(CreateValueForTarget, {
    __esModule: true
  });
});
//# sourceMappingURL=link-target.js.map
