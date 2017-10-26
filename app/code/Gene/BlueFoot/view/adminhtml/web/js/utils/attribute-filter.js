define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeFilter =
  /*#__PURE__*/
  function () {
    function AttributeFilter() {}

    var _proto = AttributeFilter.prototype;

    /**
     * Filter allowed attributes from object
     *
     * @param data
     * @returns {object}
     */
    _proto.filter = function filter(data) {
      var attributes = {};
      var allowAttributes = ['role', 'name', 'appearance'];
      Object.keys(data).map(function (key) {
        if (allowAttributes.includes(key)) {
          attributes[key] = data[key];
        }
      });
      return attributes;
    };

    return AttributeFilter;
  }();

  return AttributeFilter;
});