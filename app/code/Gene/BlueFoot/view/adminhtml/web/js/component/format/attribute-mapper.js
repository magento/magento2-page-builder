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
        appearance: 'data-appearance'
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
      var result = {};
      Object.keys(data).map(function (key) {
        var value = data[key];

        if (key in this.attributeNameMapping) {
          key = this.attributeNameMapping[key];
        }

        result[key.replace('_', '-')] = value;
      }.bind(this));
      return result;
    };

    return AttributeMapper;
  }();

  return AttributeMapper;
});
//# sourceMappingURL=attribute-mapper.js.map
