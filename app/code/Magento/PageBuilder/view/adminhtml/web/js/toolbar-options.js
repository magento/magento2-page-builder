/*eslint-disable */
define(["knockout"], function (_knockout) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var ToolbarOptions =
  /*#__PURE__*/
  function () {
    /**
     * Toolbar Options constructor
     *
     * @param parent
     * @param options
     */
    function ToolbarOptions(parent, options) {
      this.options = _knockout.observableArray([]);
      this.parent = void 0;
      this.parent = parent;
      this.options(options);
    }

    var _proto = ToolbarOptions.prototype;

    /**
     * Upon clicking the option update the value as directed
     * When user toggles the option off, set the value back to default
     *
     * @param {ToolbarOptionsInterface} option
     * @param {ToolbarOptionsValueInterface} value
     */
    _proto.onClickOption = function onClickOption(option, value) {
      var defaultValue = this.parent.config.fields[option.key].default;
      var currentValue = this.parent.previewData[option.key]();

      if (currentValue === value.value) {
        this.parent.updateData(option.key, defaultValue);
      } else {
        this.parent.updateData(option.key, value.value);
      }
    };

    _createClass(ToolbarOptions, [{
      key: "template",
      get: function get() {
        return "Magento_PageBuilder/content-type/toolbar";
      }
    }]);

    return ToolbarOptions;
  }();

  return {
    ToolbarOptions: ToolbarOptions
  };
});
//# sourceMappingURL=toolbar-options.js.map
