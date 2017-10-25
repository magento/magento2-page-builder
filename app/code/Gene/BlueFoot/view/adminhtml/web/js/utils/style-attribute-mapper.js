define([], function () {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var StyleAttributeMapper =
  /*#__PURE__*/
  function () {
    function StyleAttributeMapper() {
      _classCallCheck(this, StyleAttributeMapper);
    }

    _createClass(StyleAttributeMapper, [{
      key: "toDom",

      /**
       * Map style attribute keys to DOM key names and normalize values
       *
       * @param data
       * @returns {object}
       */
      value: function toDom(data) {
        var result = {};
        Object.keys(data).map(function (key) {
          var value = data[key];

          if (key === 'min_height') {
            value = value.replace('px', '') + 'px';
          }

          if (key === 'background_repeat') {
            value = value ? 'repeat' : 'no-repeat';
          }

          result[this.fromSnakeToCamelCase(key)] = value;
        }.bind(this));
        return result;
      }
      /**
       * Map DOM key names and values to internal format
       *
       * @param object
       * @returns {{}}
       */

    }, {
      key: "fromDom",
      value: function fromDom(object) {
        var result = {};
        Object.keys(object).map(function (key) {
          var value = object[key];

          if (key === 'minHeight') {
            value = value.replace('px', '');
          }

          if (key === 'backgroundRepeat') {
            value = value === 'repeat' ? '1' : '0';
          }

          if (key === 'backgroundColor') {
            var regexp = /(\d{3}),\s(\d{3}),\s(\d{3})/;
            var matches = regexp.exec(value);
            value = '#' + this.fromIntToHex(parseInt(matches[1])) + this.fromIntToHex(parseInt(matches[2])) + this.fromIntToHex(parseInt(matches[1]));
          }

          result[this.fromCamelToSnakeCase(key)] = value;
        }.bind(this));
        return result;
      }
      /**
       * Convert from snake case to camel case
       *
       * @param string
       * @returns {string}
       */

    }, {
      key: "fromSnakeToCamelCase",
      value: function fromSnakeToCamelCase(string) {
        var parts = string.split(/[_-]/);
        var newString = '';

        for (var i = 1; i < parts.length; i++) {
          newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
        }

        return parts[0] + newString;
      }
      /**
       * Convert from camel to snake case
       *
       * @param string
       * @returns {string}
       */

    }, {
      key: "fromCamelToSnakeCase",
      value: function fromCamelToSnakeCase(string) {
        return string.split(/(?=[A-Z])/).join('_').toLowerCase();
      }
      /**
       * Convert from int to hex
       *
       * @param value
       * @returns {string}
       */

    }, {
      key: "fromIntToHex",
      value: function fromIntToHex(value) {
        var hex = value.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
      }
    }]);

    return StyleAttributeMapper;
  }();

  return StyleAttributeMapper;
});
//# sourceMappingURL=style-attribute-mapper.js.map
