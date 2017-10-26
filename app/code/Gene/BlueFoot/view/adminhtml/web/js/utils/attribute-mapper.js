define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeMapper =
  /*#__PURE__*/
  function () {
    function AttributeMapper() {}

    var _proto = AttributeMapper.prototype;

    /**
     * Map attribute keys to DOM key names and normalize values
     *
     * @param object
     * @returns {any}
     */
    _proto.toDom = function toDom(object) {
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
    };

    return AttributeMapper;
  }();

  return AttributeMapper;
});