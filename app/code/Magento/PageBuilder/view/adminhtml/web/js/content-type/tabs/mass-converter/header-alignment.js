/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var HeaderAlignment =
  /*#__PURE__*/
  function () {
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
    };
    /**
     * Add our tab alignment class into the data for the tabs
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */


    _proto.toDom = function toDom(data, config) {
      data.css_classes += " tab-align-" + (data[config.navigation_alignment_variable] || "left");
      return data;
    };

    return HeaderAlignment;
  }();

  return _extends(HeaderAlignment, {
    __esModule: true
  });
});
//# sourceMappingURL=header-alignment.js.map
