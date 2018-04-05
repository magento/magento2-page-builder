/*eslint-disable */
define(["underscore", "Magento_PageBuilder/js/component/format/attribute-mapper", "Magento_PageBuilder/js/component/format/style-attribute-mapper"], function (_underscore, _attributeMapper, _styleAttributeMapper) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Default =
  /*#__PURE__*/
  function () {
    function Default() {
      this.attributeMapper = new _attributeMapper();
      this.styleAttributeMapper = new _styleAttributeMapper();
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

        if (element.style[property] !== "") {
          styleAttributes[property] = element.style[property];
        }
      }

      var attributes = {};
      Array.prototype.slice.call(element.attributes).forEach(function (item) {
        attributes[item.name] = item.value;
      });

      _underscore.extend(data, this.attributeMapper.fromDom(attributes), this.styleAttributeMapper.fromDom(styleAttributes));

      Object.keys(element.dataset).map(function (key) {
        if (element.dataset[key] !== "") {
          data[key.split(/(?=[A-Z])/).join("_").toLowerCase()] = element.dataset[key];
        }
      }); // Copy the css classes into the data store, excluding the pagebuilder-ROLE class

      data.css_classes = element.className || "";
      data.css_classes = data.css_classes.toString().split(" ").filter(function (className) {
        return className !== "pagebuilder-" + attributes["data-role"];
      }).join(" ");
      return new Promise(function (resolve) {
        resolve(data);
      });
    };

    return Default;
  }();

  return Default;
});
//# sourceMappingURL=default.js.map
