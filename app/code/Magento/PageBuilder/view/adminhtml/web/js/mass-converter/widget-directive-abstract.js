/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["underscore"], function (_underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var WidgetDirectiveAbstract =
  /*#__PURE__*/
  function () {
    function WidgetDirectiveAbstract() {}

    var _proto = WidgetDirectiveAbstract.prototype;

    /**
     * Convert value to internal format
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    _proto.fromDom = function fromDom(data, config) {
      var _this = this;

      var attributes = {};
      data[config.html_variable].replace(/\{\{widget(.*?)\}\}/i, function (match, attributeString) {
        attributes = _this.parseAttributesString(attributeString);
      }.bind(this));
      return attributes;
    };
    /**
     * Convert value to knockout format
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */


    _proto.toDom = function toDom(data, config) {
      data[config.html_variable] = this.buildDirective(data);
      return data;
    };
    /**
     * Build the directive string using the supplies attributes
     *
     * @param {object} attributes
     * @returns {string}
     */


    _proto.buildDirective = function buildDirective(attributes) {
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

    return WidgetDirectiveAbstract;
  }();

  return _extends(WidgetDirectiveAbstract, {
    __esModule: true
  });
});
//# sourceMappingURL=widget-directive-abstract.js.map
