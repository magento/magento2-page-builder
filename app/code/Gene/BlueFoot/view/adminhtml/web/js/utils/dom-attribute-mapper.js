define([], function () {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var DomAttributeMapper =
  /*#__PURE__*/
  function () {
    function DomAttributeMapper() {
      _classCallCheck(this, DomAttributeMapper);
    }

    _createClass(DomAttributeMapper, [{
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
            value = '#' + this.toHex(parseInt(matches[1])) + this.toHex(parseInt(matches[2])) + this.toHex(parseInt(matches[1]));
          }

          result[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = value;
        }.bind(this));
        return result;
      }
    }, {
      key: "toHex",
      value: function toHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
    }, {
      key: "toDom",
      value: function toDom(object) {
        var result = {};
        Object.keys(object).map(function (key) {
          if (key === 'role') {//key = 'data_role'
          }

          result[this.fromSnakeToCamelCase(key)] = object[key];
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
    }]);

    return DomAttributeMapper;
  }();

  return DomAttributeMapper;
});
//# sourceMappingURL=dom-attribute-mapper.js.map
