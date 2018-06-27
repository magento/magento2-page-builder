/*eslint-disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/events"], function (_jquery, _knockout, _events) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Toolbar =
  /*#__PURE__*/
  function () {
    /**
     * Toolbar Options constructor
     *
     * @param preview
     * @param options
     */
    function Toolbar(preview, options) {
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


    var _proto = Toolbar.prototype;

    /**
     * Upon clicking the option update the value as directed
     * When user toggles the option off, set the value back to default
     *
     * @param {OptionInterface} option
     * @param {ValueInterface} value
     */
    _proto.onOptionClick = function onOptionClick(option, value) {
      var defaultValue = this.preview.config.fields[option.key].default;
      var currentValue = this.preview.parent.dataStore.get()[option.key];
      this.preview.updateData(option.key, currentValue === value.value ? defaultValue : value.value);
    };
    /**
     * Set state based on toolbar focusin event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */


    _proto.onFocusIn = function onFocusIn(context, event) {
      var currentContentTypeTarget = event.currentTarget.closest(".pagebuilder-content-type");
      (0, _jquery)(currentContentTypeTarget).addClass("pagebuilder-toolbar-active");

      _events.trigger("interaction:start");
    };
    /**
     * Set state based on toolbar focusout event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */


    _proto.onFocusOut = function onFocusOut(context, event) {
      var currentContentTypeTarget = event.currentTarget.closest(".pagebuilder-content-type");
      (0, _jquery)(currentContentTypeTarget).removeClass("pagebuilder-toolbar-active");

      _events.trigger("interaction:stop");
    };

    _createClass(Toolbar, [{
      key: "template",
      get: function get() {
        return "Magento_PageBuilder/content-type-toolbar";
      }
    }]);

    return Toolbar;
  }();

  return Toolbar;
});
//# sourceMappingURL=content-type-toolbar.js.map
