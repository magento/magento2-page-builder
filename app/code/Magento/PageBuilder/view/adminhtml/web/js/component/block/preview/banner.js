/*eslint-disable */
define(["knockout", "mage/translate", "./block"], function (_knockout, _translate, _block) {
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
        style: "background-image: " + backgroundImage + "; min-height: " + this.data.minimum_height() + "px; background-size: " + this.data.background_size() + ";"
      };
    };
    /**
     * Get the banner overlay attributes for the preview
     *
     * @returns {any}
     */


    _proto.getPreviewOverlayAttributes = function getPreviewOverlayAttributes() {
      var backgroundColor = this.data.show_overlay() === "always" || this.showOverlayHover() ? this.convertHexToRgba() : "transparent";
      return {
        style: "min-height: " + this.data.minimum_height() + "px; background-color: " + backgroundColor + ";"
      };
    };
    /**
     * Convert HEX to RGBA for transparent overlay for the preview
     *
     * @returns {string}
     */


    _proto.convertHexToRgba = function convertHexToRgba() {
      if (this.data.overlay_color() !== "" && this.data.overlay_color() !== undefined) {
        var colors = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.data.overlay_color()),
            red = parseInt(colors[1], 16),
            green = parseInt(colors[2], 16),
            blue = parseInt(colors[3], 16),
            alpha = this.convertPercentToDecimal(this.data.overlay_transparency());
        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
      } else {
        return "transparent";
      }
    };
    /**
     * Convert percent to decimal for transparent overlay for the preview
     *
     * @param {string} value
     * @returns {string}
     */


    _proto.convertPercentToDecimal = function convertPercentToDecimal(value) {
      return (parseInt(value, 10) / 100).toString();
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
     * Get the banner content attributes for the preview
     *
     * @returns {any}
     */


    _proto.getPreviewContentAttributes = function getPreviewContentAttributes() {
      if (this.data.margins_and_padding() !== "" && this.data.margins_and_padding() !== undefined) {
        var marginTop = this.data.margins_and_padding().margin.top || "0",
            marginRight = this.data.margins_and_padding().margin.right || "0",
            marginBottom = this.data.margins_and_padding().margin.bottom || "0",
            marginLeft = this.data.margins_and_padding().margin.left || "0",
            paddingTop = this.data.margins_and_padding().padding.top || "0",
            paddingRight = this.data.margins_and_padding().padding.right || "0",
            paddingBottom = this.data.margins_and_padding().padding.bottom || "0",
            paddingLeft = this.data.margins_and_padding().padding.left || "0";
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
        return (0, _translate)(this.data.button_text());
      }
    };
    /**
     * Set state based on overlay mouseover event for the preview
     *
     */


    _proto.mouseoverBanner = function mouseoverBanner() {
      if (this.preview.data.show_overlay() === 'on_hover') {
        this.preview.showOverlayHover(true);
      }
    };
    /**
     * Set state based on overlay mouseout event for the preview
     *
     */


    _proto.mouseoutBanner = function mouseoutBanner() {
      if (this.preview.data.show_overlay() === 'on_hover') {
        this.preview.showOverlayHover(false);
      }
    };

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
