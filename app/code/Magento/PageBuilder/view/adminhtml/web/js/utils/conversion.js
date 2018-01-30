/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Convert percent to decimal
   *
   * @param {string} value
   * @returns {string}
   */
  function convertPercentToDecimal(value) {
    return (parseInt(value, 10) / 100).toString();
  }
  /**
   * Convert HEX value to RGB or RGBA
   *
   * @param hexValue
   * @param alphaValue optional
   * @returns {string}
   */


  function colorConverter(hexValue, alphaValue) {
    var colors = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
    var red = parseInt(colors[1], 16);
    var green = parseInt(colors[2], 16);
    var blue = parseInt(colors[3], 16);

    if (alphaValue) {
      return "rgba(" + red + "," + green + "," + blue + "," + alphaValue + ")";
    } else {
      return "rgba(" + red + "," + green + "," + blue + ")";
    }
  }

  return {
    convertPercentToDecimal: convertPercentToDecimal,
    colorConverter: colorConverter
  };
});
//# sourceMappingURL=conversion.js.map
