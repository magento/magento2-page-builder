/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Convert HEX value to RGB or RGBA
   *
   * @param hexValue
   * @param alphaValue optional
   * @returns {string}
   * @api
   */
  function fromHex(hexValue, alphaValue) {
    var shorthandHexRegEx = /^#([a-f\d])([a-f\d])([a-f\d])$/i;
    hexValue = hexValue.replace(shorthandHexRegEx, function (m, r, g, b) {
      return "#" + r + r + g + g + b + b;
    });
    var colors = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
    var red = parseInt(colors[1], 16);
    var green = parseInt(colors[2], 16);
    var blue = parseInt(colors[3], 16);

    if (alphaValue === "NaN") {
      alphaValue = "1";
    }

    if (alphaValue) {
      return "rgba(" + red + "," + green + "," + blue + "," + alphaValue + ")";
    } else {
      return "rgba(" + red + "," + green + "," + blue + ")";
    }
  }
  /**
   * Adds 0 if HEX value is string character
   *
   * @returns string
   * @api
   */


  function padZero(value) {
    if (value.length === 1) {
      value = "0" + value;
    }

    return value;
  }
  /**
   * Convert RGB or RGBA value to HEX
   *
   * @param value "rgba(255,85,51,0.2)"
   * @returns {string}
   * @api
   */


  function toHex(value) {
    var values = value.replace("#", "").match(/\d+/g);
    var r = parseInt(values[0], 10).toString(16);
    var g = parseInt(values[1], 10).toString(16);
    var b = parseInt(values[2], 10).toString(16);
    return "#" + padZero(r) + padZero(g) + padZero(b);
  }

  return {
    __esModule: true,
    fromHex: fromHex,
    toHex: toHex
  };
});
//# sourceMappingURL=color-converter.js.map
