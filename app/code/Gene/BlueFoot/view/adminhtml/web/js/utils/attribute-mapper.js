define([], function () {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeMapper =
  /*#__PURE__*/
  function () {
    function AttributeMapper() {
      _classCallCheck(this, AttributeMapper);
    }

    _createClass(AttributeMapper, [{
      key: "toDom",

      /**
       * Map attribute keys to DOM key names and normalize values
       *
       * @param object
       * @returns {any}
       */
      value: function toDom(object) {
        var result = {};
        Object.keys(object).map(function (key) {
          var value = object[key];

          if (key === 'role' || key === 'name') {
            key = 'data-role';
          }

          if (key === 'appearance') {
            key = 'data-appearance';
          }

          result[key.replace('_', '-')] = value;
        }.bind(this));
        return result;
      }
    }]);

    return AttributeMapper;
  }();

  return AttributeMapper;
});
//# sourceMappingURL=attribute-mapper.js.map
