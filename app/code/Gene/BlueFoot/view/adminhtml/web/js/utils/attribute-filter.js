define([], function () {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeFilter =
  /*#__PURE__*/
  function () {
    function AttributeFilter() {
      _classCallCheck(this, AttributeFilter);
    }

    _createClass(AttributeFilter, [{
      key: "filter",

      /**
       * Filter allowed attributes from object
       *
       * @param data
       * @returns {object}
       */
      value: function filter(data) {
        var attributes = {};
        var allowAttributes = ['role', 'name', 'appearance'];
        Object.keys(data).map(function (key) {
          if (allowAttributes.includes(key)) {
            attributes[key] = data[key];
          }
        });
        return attributes;
      }
    }]);

    return AttributeFilter;
  }();

  return AttributeFilter;
});
//# sourceMappingURL=attribute-filter.js.map
