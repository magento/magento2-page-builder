define(["underscore", "../style-attribute-mapper"], function (_underscore, _styleAttributeMapper) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Default =
  /*#__PURE__*/
  function () {
    function Default() {
      this.styleAttributeMapper = void 0;
      this.styleAttributeMapper = new _styleAttributeMapper();
    }
    /**
     * Read data, style and css properties from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */


    var _proto = Default.prototype;

    _proto.read = function read(element) {
      var data = {};
      var styleAttributes = {};

      for (var i = 0; i < element.style.length; i++) {
        var property = element.style.item(i);

        if (element.style[property] !== '') {
          styleAttributes[property] = element.style[property];
        }
      }

      _underscore.extend(data, this.styleAttributeMapper.fromDom(styleAttributes));

      Object.keys(element.dataset).map(function (key) {
        if (element.dataset[key] !== '') {
          data[key] = element.dataset[key];
        }
      });
      data['css_classes'] = element.className.split(' ').filter(function (value) {
        return value.length > 0;
      });
      return new Promise(function (resolve) {
        console.log(data);
        resolve(data);
      });
    };

    return Default;
  }();

  return Default;
});
//# sourceMappingURL=default.js.map
