/*eslint-disable */
define(["knockout"], function (_knockout) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var ToolbarOption =
  /*#__PURE__*/
  function () {
    /**
     * Toolbar Options constructor
     *
     * @param preview
     * @param options
     */
    function ToolbarOption(preview, options) {
      this.options = _knockout.observableArray([]);
      this.preview = void 0;
      this.preview = preview;
      this.options(options);
    }
    /**
     * Toolbar template
     *
     * @returns {string}
     */


    var _proto = ToolbarOption.prototype;

    /**
     * Upon clicking the option update the value as directed
     * When user toggles the option off, set the value back to default
     *
     * @param {OptionInterface} option
     * @param {ValueInterface} value
     */
    _proto.onClickOption = function onClickOption(option, value) {
      var defaultValue = this.preview.config.fields[option.key].default;
      var currentValue = this.preview.previewData[option.key]();

      if (currentValue === value.value) {
        this.preview.updateData(option.key, defaultValue);
      } else {
        this.preview.updateData(option.key, value.value);
      }
    };

    _createClass(ToolbarOption, [{
      key: "template",
      get: function get() {
        return "Magento_PageBuilder/content-type/toolbar";
      }
    }]);

    return ToolbarOption;
  }();

  return ToolbarOption;
});
//# sourceMappingURL=option.js.map
