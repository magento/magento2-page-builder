define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeFilter =
  /*#__PURE__*/
  function () {
    function AttributeFilter() {
      this.allowAttributes = ['name', 'appearance'];
    }

    var _proto = AttributeFilter.prototype;

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    _proto.filter = function filter(data) {
      var attributes = {};
      Object.keys(data).map(function (key) {
        if (this.allowAttributes.includes(key)) {
          attributes[key] = data[key];
        }
      }.bind(this));
      return attributes;
    };

    return AttributeFilter;
  }();

  return AttributeFilter;
});
//# sourceMappingURL=attribute-filter.js.map
