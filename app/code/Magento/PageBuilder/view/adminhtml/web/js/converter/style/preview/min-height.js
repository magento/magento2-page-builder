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
     * Ensure the min-height property doesn't persist to the preview
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return;
    }
    /**
     * Ensure the min-height property doesn't persist to the preview in case of full height.
     *
     * @param name string
     * @param data Object
     * @returns string
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var value = (0, _object.get)(data, name);

      if (value === "100vh") {
        return;
      }

      return _removePx2.prototype.toDom.call(this, name, data);
    };

    return MinHeight;
  }(_removePx);

  return MinHeight;
});
//# sourceMappingURL=min-height.js.map