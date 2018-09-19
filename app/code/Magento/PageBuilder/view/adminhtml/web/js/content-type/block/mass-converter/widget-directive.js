/*eslint-disable */
define(["Magento_PageBuilder/js/mass-converter/widget-directive-abstract"], function (_widgetDirectiveAbstract) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * Enables the settings of the content type to be stored as a widget directive.
   *
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

      data.template = attributes.template;
      data.block_id = attributes.block_id;
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
        type: "Magento\\Cms\\Block\\Widget\\Block",
        template: data.template,
        block_id: data.block_id,
        type_name: "CMS Static Block"
      };

      if (!attributes.block_id || !attributes.template) {
        return data;
      }

      data[config.html_variable] = this.buildDirective(attributes);
      return data;
    };

    return WidgetDirective;
  }(_widgetDirectiveAbstract);

  return Object.assign(WidgetDirective, {
    __esModule: true
  });
});
//# sourceMappingURL=widget-directive.js.map
