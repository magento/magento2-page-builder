/*eslint-disable */
define(["underscore"], function (_underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ProductsDirective =
  /*#__PURE__*/
  function () {
    function ProductsDirective() {}

    var _proto = ProductsDirective.prototype;

    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      var _this = this;

      var attributes = {};
      value.replace(/\{\{widget(.*?)\}\}/i, function (match, attributeString) {
        attributes = _this.parseAttributesString(attributeString);
      }.bind(this));
      attributes.conditions_encoded = this.decodeWysiwygCharacters(attributes.conditions_encoded || "");
      return attributes;
    };
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      var attributes = {
        type: "Magento\\CatalogWidget\\ContentType\\Product\\ProductsList",
        template: "Magento_CatalogWidget::product/widget/content/grid.phtml",
        anchor_text: "",
        id_path: "",
        show_pager: 0,
        products_count: data.products_count,
        type_name: "Catalog Products List",
        conditions_encoded: this.encodeWysiwygCharacters(data.conditions_encoded || "")
      };

      if (attributes.conditions_encoded.length === 0) {
        return "";
      }

      return "{{widget " + this.createAttributesString(attributes) + "}}";
    };
    /**
     * @param {string} attributes
     * @return {Object}
     */


    _proto.parseAttributesString = function parseAttributesString(attributes) {
      var result = {};
      attributes.replace(/(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g, function (match, key, value) {
        result[key] = value.replace(/&quote;/g, "\"");
      });
      return result;
    };
    /**
     * @param {Object} attributes
     * @return {string}
     */


    _proto.createAttributesString = function createAttributesString(attributes) {
      var result = "";

      _underscore.each(attributes, function (value, name) {
        result += name + "=\"" + String(value).replace(/"/g, "&quote;") + "\" ";
      });

      return result.substr(0, result.length - 1);
    };
    /**
     * @param {string} content
     * @returns {string}
     */


    _proto.encodeWysiwygCharacters = function encodeWysiwygCharacters(content) {
      return content.replace(/\{/g, "^[").replace(/\}/g, "^]").replace(/"/g, "`").replace(/\\/g, "|");
    };
    /**
     * @param {string} content
     * @returns {string}
     */


    _proto.decodeWysiwygCharacters = function decodeWysiwygCharacters(content) {
      return content.replace(/\^\[/g, "{").replace(/\^\]/g, "}").replace(/`/g, "\"").replace(/\|/g, "\\");
    };

    return ProductsDirective;
  }();

  return ProductsDirective;
});
//# sourceMappingURL=products-directive.js.map
