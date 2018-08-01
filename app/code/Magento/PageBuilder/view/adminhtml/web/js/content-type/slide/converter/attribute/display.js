/*eslint-disable */
define(["Magento_PageBuilder/js/converter/attribute/display"], function (_display) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Display =
  /*#__PURE__*/
  function (_BaseDisplay) {
    _inheritsLoose(Display, _BaseDisplay);

    function Display() {
      return _BaseDisplay.apply(this, arguments) || this;
    }

    var _proto = Display.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {boolean}
     */
    _proto.fromDom = function fromDom(value) {
      return true;
    };
    /**
     * Hide the slide if the slide is empty on the storefront, fallback to support the ability to hide items
     *
     * @param name string
     * @param data Object
     * @returns {string | void}
     */


    _proto.toDom = function toDom(name, data) {
      if (data.background_color === "" && data.background_image.length === 0 && (!data.link_url || !data.link_url.default || data.link_url.default === "") && data.content === "" && data.show_button === "never" && data.show_overlay === "never") {
        return "false";
      }

      return _BaseDisplay.prototype.toDom.call(this, name, data);
    };

    return Display;
  }(_display);

  return Display;
});
//# sourceMappingURL=display.js.map
