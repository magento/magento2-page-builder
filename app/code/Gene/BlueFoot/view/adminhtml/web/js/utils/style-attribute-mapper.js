define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var StyleAttributeMapper =
  /*#__PURE__*/
  function () {
    function StyleAttributeMapper() {}

    var _proto = StyleAttributeMapper.prototype;

    /**
     * Map style attribute keys to DOM key names and normalize values
     *
     * @param data
     * @returns {object}
     */
    _proto.toDom = function toDom(data) {
      var result = {};
      Object.keys(data).map(function (key) {
        var value = data[key];

        if (!value) {
          return;
        }

        if (key === 'min_height') {
          value = value.replace('px', '') + 'px';
        }

        if (key === 'background_repeat') {
          value = value ? 'repeat' : 'no-repeat';
        }

        result[this.fromSnakeToCamelCase(key)] = value;
      }.bind(this));
      return result;
    };
    /**
     * Map DOM key names and values to internal format
     *
     * @param object
     * @returns {{}}
     */


    _proto.fromDom = function fromDom(object) {
      var result = {};
      Object.keys(object).map(function (key) {
        var value = object[key];

        if (key === 'min-height') {
          value = value.replace('px', '');
        }

        if (key === 'background-repeat') {
          value = value === 'repeat' ? '1' : '0';
        }

        if (key === 'background-color') {
          var regexp = /(\d{3}),\s(\d{3}),\s(\d{3})/;
          var matches = regexp.exec(value);
          value = '#' + this.fromIntToHex(parseInt(matches[1])) + this.fromIntToHex(parseInt(matches[2])) + this.fromIntToHex(parseInt(matches[1]));
        }

        result[key.replace('-', '_')] = value;
      }.bind(this));
      return result;
    };
    /**
     * Convert from snake case to camel case
     *
     * @param string
     * @returns {string}
     */


    _proto.fromSnakeToCamelCase = function fromSnakeToCamelCase(string) {
      var parts = string.split(/[_-]/);
      var newString = '';

      for (var i = 1; i < parts.length; i++) {
        newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
      }

      return parts[0] + newString;
    };
    /**
     * Convert from int to hex
     *
     * @param value
     * @returns {string}
     */


    _proto.fromIntToHex = function fromIntToHex(value) {
      var hex = value.toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    };

    return StyleAttributeMapper;
  }();

  return StyleAttributeMapper;
});
//# sourceMappingURL=style-attribute-mapper.js.map
