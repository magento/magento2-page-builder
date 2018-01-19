/*eslint-disable */
define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Banner =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Banner, _PreviewBlock);

    function Banner() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Banner.prototype;

    /**
     * Retrieve the banner attributes for the preview
     *
     * @returns {any}
     */
    _proto.getOverlayAttributes = function getOverlayAttributes() {
      if (this.data.show_overlay() === "never_show") {
        return;
      } else if (this.data.show_overlay() === "always") {
        if (this.data.overlay_color() != undefined && this.data.overlay_transparency()) {
          return {
            style: "background-color: " + this.data.overlay_color() + "; opacity: " + this.data.overlay_transparency() / 100
          };
        }
      }
    };

    _proto.getButtonText = function getButtonText() {
      if (this.data.button_text() === undefined) {
        return "Edit Button Text";
      } else {
        return this.data.button_text();
      }
    };

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
