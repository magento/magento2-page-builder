/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Extract the Alpha component from RGBA and convert from decimal to percent for overlay transparency
   *
   * @returns int
   * @api
   */
  function extractAlphaFromRgba(value) {
    var a = parseFloat(value.match(/\d+/g)[3] + "." + value.match(/\d+/g)[4]) || 0;
    return Math.floor(a * 100);
  }

  return Object.assign(extractAlphaFromRgba, {
    __esModule: true
  });
});
//# sourceMappingURL=extract-alpha-from-rgba.js.map
