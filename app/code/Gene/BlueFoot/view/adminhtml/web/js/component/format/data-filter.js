define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var DataFilter =
  /*#__PURE__*/
  function () {
    function DataFilter() {
      this.allowedAttributes = void 0;
    }

    var _proto = DataFilter.prototype;

    /**
     * Create a mapping of strings to booleans
     *
     * @param array
     * @returns {DataObject}
     */
    _proto.toDataObject = function toDataObject(array) {
      return array.reduce(function (acc, next) {
        acc[next] = true;
        return acc;
      }, {});
    };
    /**
     * Filters attributes in a DataObject
     *
     * @param data
     * @param attributes
     * @returns {DataObject}
     */


    _proto.filterAttributes = function filterAttributes(data) {
      var result = {};

      for (var key in data) {
        if (this.allowedAttributes[key]) {
          result[key] = data[key];
        }
      }

      return result;
    };
    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */


    _proto.filter = function filter(data) {
      return this.filterAttributes(data);
    };

    return DataFilter;
  }();

  return DataFilter;
});
//# sourceMappingURL=data-filter.js.map
