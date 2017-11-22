define(["underscore", "../style-attribute-mapper", "../attribute-mapper"], function (_underscore, _styleAttributeMapper, _attributeMapper) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Default =
  /*#__PURE__*/
  function () {
    function Default() {
      this.styleAttributeMapper = new _styleAttributeMapper();
      this.attributeMapper = new _attributeMapper();
    }

    var _proto = Default.prototype;

    /**
     * Read data, style and css properties from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var data = {};
      var styleAttributes = {};

      for (var i = 0; i < element.style.length; i++) {
        var property = element.style.item(i);

        if (element.style[property] !== '') {
          styleAttributes[property] = element.style[property];
        }
      }

      var attributes = {};
      Array.prototype.slice.call(element.attributes).forEach(function (item) {
        attributes[item.name] = item.value;
      });

      _underscore.extend(data, this.attributeMapper.fromDom(attributes), this.styleAttributeMapper.fromDom(styleAttributes));

      Object.keys(element.dataset).map(function (key) {
        if (element.dataset[key] !== '') {
          data[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = element.dataset[key];
        }
      });
      data['css_classes'] = element.className.split(' ').filter(function (value) {
        return value.length > 0;
      });
      return new Promise(function (resolve) {
        resolve(data);
      });
    };

    return Default;
  }();

  return Default;
});
//# sourceMappingURL=default.js.map
