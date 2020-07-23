/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var HeaderAlignment =
  /*#__PURE__*/
  function () {
    "use strict";

    function HeaderAlignment() {}

    var _proto = HeaderAlignment.prototype;

    /**
     * Process data after it's read and converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    _proto.fromDom = function fromDom(data, config) {
      return data;
    }
    /**
     * Add our tab alignment class into the data for the tabs
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    ;

    _proto.toDom = function toDom(data, config) {
      data.css_classes += " tab-align-" + (0, _object.get)(data, config.navigation_alignment_variable, "left");
      return data;
    };

    return HeaderAlignment;
  }();

  return HeaderAlignment;
});
//# sourceMappingURL=header-alignment.js.map