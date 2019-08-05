/*eslint-disable */
define(["underscore"], function (_underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var StylePropertyReader =
  /*#__PURE__*/
  function () {
    "use strict";

    function StylePropertyReader() {}

    var _proto = StylePropertyReader.prototype;

    /**
     * Read styles for the element
     *
     * @param element
     * @param source
     * @param styles
     */
    _proto.read = function read(element, source, styles) {
      if (!styles || !styles.length) {
        return "";
      }

      var styleValue = "";
      styles.forEach(function (style) {
        var value = style.getPropertyValue(source.replace("_", "-"));

        if (!_underscore.isEmpty(value)) {
          styleValue = value;
        }
      });
      return styleValue;
    };

    return StylePropertyReader;
  }();

  return StylePropertyReader;
});
//# sourceMappingURL=style-property-reader.js.map