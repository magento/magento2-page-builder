/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MaxWidth =
  /*#__PURE__*/
  function () {
    function MaxWidth() {
      this.ratioNumerator = 16;
      this.ratioDenominator = 9;
    }

    var _proto = MaxWidth.prototype;

    /**
     * Convert value to internal format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    _proto.fromDom = function fromDom(data, config) {
      return data;
    };
    /**
     * Convert value to knockout format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */


    _proto.toDom = function toDom(data, config) {
      var specifiedWidth = (data[config.max_width_variable] || '').replace('px', '');
      var specifiedHeight = (data[config.max_height_variable] || '').replace('px', '');

      if (specifiedWidth && !specifiedHeight) {
        data[config.max_width_variable] = specifiedWidth + "px";
      } else if (!specifiedWidth && specifiedHeight) {
        // Calculate the max width that would create the max height
        data[config.max_width_variable] = specifiedHeight / this.ratioDenominator * this.ratioNumerator + "px";
      } else if (specifiedWidth && specifiedHeight) {
        // The max height won't be met with the supplied width
        if (specifiedWidth / this.ratioNumerator * this.ratioDenominator < specifiedHeight) {
          data[config.max_width_variable] = specifiedWidth + "px";
        } else {
          // Calculate the max width that would create the max height
          data[config.max_width_variable] = specifiedHeight / this.ratioDenominator * this.ratioNumerator + "px";
        }
      }

      return data;
    };

    return MaxWidth;
  }();

  return MaxWidth;
});
//# sourceMappingURL=max-width.js.map
