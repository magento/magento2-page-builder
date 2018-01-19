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
     * Get the banner overlay attributes for the preview
     *
     * @returns {any}
     */
    _proto.getPreviewBannerAttributes = function getPreviewBannerAttributes() {
      var backgroundImage = "none",
          minHeight = "250px",
          backgroundSize = "cover";

      if (this.data.image() !== "" && this.data.image() !== undefined && this.data.image()[0] !== undefined) {
        backgroundImage = "url(" + this.data.image()[0].url + ")";
      }

      return {
        style: "background-image: " + backgroundImage + "; min-height: " + minHeight + "; background-size: " + backgroundSize + ";"
      };
    };
    /**
     * Get the banner overlay attributes for the preview
     *
     * @returns {any}
     */


    _proto.getPreviewOverlayAttributes = function getPreviewOverlayAttributes() {
      var backgroundColor = this.data.show_overlay() === "never_show" ? "transparent" : "rgba(0,0,0,0.3)";
      return {
        style: "min-height: 250px; background-color: " + backgroundColor + ";"
      };
    };
    /**
     * Is there content in the WYSIWYG?
     *
     * @returns {boolean}
     */


    _proto.isBannerEmpty = function isBannerEmpty() {
      return this.data.message() === "" || this.data.message() === undefined ? true : false;
    };
    /**
     * Get the content for the preview
     *
     * @returns {any}
     */


    _proto.getContentHtml = function getContentHtml() {
      if (this.data.message() === "" || this.data.message() === undefined) {
        return "Write banner text here...";
      } else {
        return this.data.message();
      }
    };
    /**
     * Get the button text for the preview
     *
     * @returns {any}
     */


    _proto.getButtonText = function getButtonText() {
      if (this.data.button_text() === "" || this.data.button_text() === undefined) {
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
