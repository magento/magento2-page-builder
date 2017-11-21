define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeMapper =
  /*#__PURE__*/
  function () {
    function AttributeMapper() {
      this.attributeNameMapping = {
        name: 'data-role',
        appearance: 'data-appearance',
        src: 'src'
      };
    }

    var _proto = AttributeMapper.prototype;

    /**
     * Map attribute keys to DOM key names and normalize values
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    _proto.toDom = function toDom(data) {
      var _this = this;

      var result = {};
      Object.keys(data).map(function (key) {
        var value = data[key];

        if (key in _this.attributeNameMapping) {
          key = _this.attributeNameMapping[key];
        }

        result[key.replace('_', '-')] = value;
      });
      return result;
    };
    /**
     * Convert attributes from the DOM into the data store
     * @param {} data
     * @returns {}
     */


    _proto.fromDom = function fromDom(data) {
      var _this2 = this;

      // Flip the object key / values
      var attributeMapping = Object.keys(this.attributeNameMapping).reduce(function (obj, key) {
        obj[_this2.attributeNameMapping[key]] = key;
        return obj;
      }, {}),
          result = {};
      Object.keys(data).map(function (key) {
        if (key in attributeMapping) {
          result[attributeMapping[key]] = data[key];
        }
      });
      return result;
    };

    return AttributeMapper;
  }();

  return AttributeMapper;
});
//# sourceMappingURL=attribute-mapper.js.map
