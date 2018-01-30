/*eslint-disable */
define(["knockout", "mage/translate", "../../../utils/conversion", "./block"], function (_knockout, _translate, _conversion, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Banner =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Banner, _PreviewBlock);

    function Banner() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewBlock.call.apply(_PreviewBlock, [this].concat(args)) || this, _this.showOverlayHover = _knockout.observable(false), _temp) || _this;
    }

    var _proto = Banner.prototype;

    /**
     * Get the banner wrapper attributes for the preview
     *
     * @returns {any}
     */
    _proto.getPreviewBannerAttributes = function getPreviewBannerAttributes() {
      var backgroundImage = "none";

      if (this.data.image() !== "" && this.data.image() !== undefined && this.data.image()[0] !== undefined) {
        backgroundImage = "url(" + this.data.image()[0].url + ")";
      }

      return {
        style: "background-image: " + backgroundImage + "; " + "background-size: " + this.data.background_size() + ";" + "min-height: " + this.data.minimum_height() + "px; "
      };
    };
    /**
     * Get the banner overlay attributes for the preview
     *
     * @returns {any}
     */


    _proto.getPreviewOverlayAttributes = function getPreviewOverlayAttributes() {
      var backgroundColor = "transparent";

      if (this.data.show_overlay() === "always" || this.showOverlayHover()) {
        if (this.data.overlay_color() !== "" && this.data.overlay_color() !== undefined) {
          var colors = this.data.overlay_color();

          var alpha = _conversion.convertPercentToDecimal(this.data.overlay_transparency());

          backgroundColor = _conversion.colorConverter(colors, alpha);
        } else {
          backgroundColor = "transparent";
        }
      }

      return {
        style: "min-height: " + this.data.minimum_height() + "px; background-color: " + backgroundColor + ";"
      };
    };
    /**
     * Is there content in the WYSIWYG?
     *
     * @returns {boolean}
     */


    _proto.isBannerEmpty = function isBannerEmpty() {
      return this.data.message() === "" || this.data.message() === undefined;
    };
    /**
     * Get the banner content attributes for the preview
     *
     * @returns {any}
     */


    _proto.getPreviewContentAttributes = function getPreviewContentAttributes() {
      if (this.data.margins_and_padding() !== "" && this.data.margins_and_padding() !== undefined) {
        var marginTop = this.data.margins_and_padding().margin.top || "0";
        var marginRight = this.data.margins_and_padding().margin.right || "0";
        var marginBottom = this.data.margins_and_padding().margin.bottom || "0";
        var marginLeft = this.data.margins_and_padding().margin.left || "0";
        var paddingTop = this.data.margins_and_padding().padding.top || "0";
        var paddingRight = this.data.margins_and_padding().padding.right || "0";
        var paddingBottom = this.data.margins_and_padding().padding.bottom || "0";
        var paddingLeft = this.data.margins_and_padding().padding.left || "0";
        return {
          style: "margin-top: " + marginTop + "px; " + "margin-right: " + marginRight + "px; " + "margin-bottom: " + marginBottom + "px; " + "margin-left: " + marginLeft + "px; " + "padding-top: " + paddingTop + "px; " + "padding-right: " + paddingRight + "px; " + "padding-bottom: " + paddingBottom + "px; " + "padding-left: " + paddingLeft + "px;"
        };
      }
    };
    /**
     * Get the content for the preview
     *
     * @returns {any}
     */


    _proto.getContentHtml = function getContentHtml() {
      if (this.data.message() === "" || this.data.message() === undefined) {
        return (0, _translate)("Write banner text here...");
      } else {
        return (0, _translate)(this.data.message());
      }
    };
    /**
     * Get the button text for the preview
     *
     * @returns {any}
     */


    _proto.getButtonText = function getButtonText() {
      if (this.data.button_text() === "" || this.data.button_text() === undefined) {
        return (0, _translate)("Edit Button Text");
      } else {
        return this.data.button_text();
      }
    };
    /**
     * Set state based on overlay mouseover event for the preview
     */


    _proto.mouseoverBanner = function mouseoverBanner() {
      if (this.preview.data.show_overlay() === "on_hover") {
        this.preview.showOverlayHover(true);
      }
    };
    /**
     * Set state based on overlay mouseout event for the preview
     */


    _proto.mouseoutBanner = function mouseoutBanner() {
      if (this.preview.data.show_overlay() === "on_hover") {
        this.preview.showOverlayHover(false);
      }
    };

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
