/*eslint-disable */
/* jscs:disable */

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["Magento_PageBuilder/js/utils/object", "Magento_PageBuilder/js/converter/style/remove-px"], function (_object, _removePx) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var MinHeight =
  /*#__PURE__*/
  function (_removePx2) {
    "use strict";

    _inheritsLoose(MinHeight, _removePx2);

    function MinHeight() {
      return _removePx2.apply(this, arguments) || this;
    }

    var _proto = MinHeight.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      if (value === "100vh") {
        return "";
      }

      return _removePx2.prototype.fromDom.call(this, value);
    }
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      if ((0, _object.get)(data, "full_min_height") === "true") {
        return "100vh";
      }

      return _removePx2.prototype.toDom.call(this, name, data);
    };

    return MinHeight;
  }(_removePx);

  return MinHeight;
});
//# sourceMappingURL=min-height.js.map