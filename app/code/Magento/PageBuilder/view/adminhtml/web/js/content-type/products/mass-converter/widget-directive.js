/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["Magento_PageBuilder/js/mass-converter/widget-directive-abstract"], function (_widgetDirectiveAbstract) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var WidgetDirective =
  /*#__PURE__*/
  function (_BaseWidgetDirective) {
    _inheritsLoose(WidgetDirective, _BaseWidgetDirective);

    function WidgetDirective() {
      return _BaseWidgetDirective.apply(this, arguments) || this;
    }

    var _proto = WidgetDirective.prototype;

    /**
     * Convert value to internal format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    _proto.fromDom = function fromDom(data, config) {
      var attributes = _BaseWidgetDirective.prototype.fromDom.call(this, data, config);

      data.conditions_encoded = this.decodeWysiwygCharacters(attributes.conditions_encoded || "");
      data.products_count = attributes.products_count;
      return data;
    };
    /**
     * Convert value to knockout format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */


    _proto.toDom = function toDom(data, config) {
      var attributes = {
        type: "Magento\\CatalogWidget\\Block\\Product\\ProductsList",
        template: "Magento_CatalogWidget::product/widget/content/grid.phtml",
        anchor_text: "",
        id_path: "",
        show_pager: 0,
        products_count: data.products_count,
        type_name: "Catalog Products List",
        conditions_encoded: this.encodeWysiwygCharacters(data.conditions_encoded || "")
      };

      if (attributes.conditions_encoded.length === 0) {
        return data;
      }

      data[config.html_variable] = this.buildDirective(attributes);
      return data;
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

    return WidgetDirective;
  }(_widgetDirectiveAbstract);

  return _extends(WidgetDirective, {
    __esModule: true
  });
});
//# sourceMappingURL=widget-directive.js.map
