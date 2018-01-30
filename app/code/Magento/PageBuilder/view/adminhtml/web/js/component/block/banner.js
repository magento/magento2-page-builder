/*eslint-disable */
define(["mage/translate", "underscore", "../../utils/conversion", "../config", "./block"], function (_translate, _underscore, _conversion, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Banner =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Banner, _Block);

    function Banner() {
      return _Block.apply(this, arguments) || this;
    }

    /**
     * Retrieve the image URL with directive
     *
     * @param {Array} image
     * @returns {string}
     */
    Banner.getImageUrl = function getImageUrl(image) {
      var imageUrl = image[0].url;

      var mediaUrl = _config.getInitConfig("media_url");

      var mediaPath = imageUrl.split(mediaUrl);
      return "{{media url=" + mediaPath[1] + "}}";
    };
    /**
     * Get the banner wrapper attributes for the storefront
     *
     * @returns {any}
     */


    var _proto = Banner.prototype;

    _proto.getBannerAttributes = function getBannerAttributes(type) {
      var data = this.getData();
      var backgroundImage = "";

      if (type === "image") {
        backgroundImage = this.getImage() ? "url(" + this.getImage() + ")" : "none";
      } else if (type === "mobileImage") {
        backgroundImage = this.getMobileImage() ? "url(" + this.getMobileImage() + ")" : "none";
      }

      return {
        style: "background-image: " + backgroundImage + "; " + "min-height: " + data.minimum_height + "px; " + "background-size: " + data.background_size + ";"
      };
    };
    /**
     * Get the banner overlay attributes for the storefront
     *
     * @returns {any}
     */


    _proto.getOverlayAttributes = function getOverlayAttributes() {
      var data = this.getData();
      var bgColorAttr = "transparent";
      var bgColor = "transparent";

      if (data.show_overlay !== "never_show") {
        if (data.overlay_color !== "" && data.overlay_color !== undefined) {
          bgColorAttr = _conversion.colorConverter(data.overlay_color, _conversion.convertPercentToDecimal(data.overlay_transparency));
        } else {
          bgColorAttr = "transparent";
        }
      }

      if (data.show_overlay === "never_show" || data.show_overlay === "on_hover") {
        bgColor = "transparent";
      } else {
        if (data.overlay_color !== "" && data.overlay_color !== undefined) {
          bgColor = _conversion.colorConverter(data.overlay_color, _conversion.convertPercentToDecimal(data.overlay_transparency));
        } else {
          bgColor = "transparent";
        }
      }

      return {
        "data-background-color": bgColorAttr,
        "style": "min-height: " + data.minimum_height + "px; background-color: " + bgColor + ";"
      };
    };
    /**
     * Get the banner content attributes for the storefront
     *
     * @returns {any}
     */


    _proto.getContentAttributes = function getContentAttributes() {
      var data = this.getData();
      var marginTop = data.fields.margins_and_padding.default.margin.top || "0";
      var marginRight = data.fields.margins_and_padding.default.margin.right || "0";
      var marginBottom = data.fields.margins_and_padding.default.margin.bottom || "0";
      var marginLeft = data.fields.margins_and_padding.default.margin.left || "0";
      var paddingTop = data.fields.margins_and_padding.default.padding.top || "0";
      var paddingRight = data.fields.margins_and_padding.default.padding.right || "0";
      var paddingBottom = data.fields.margins_and_padding.default.padding.bottom || "0";
      var paddingLeft = data.fields.margins_and_padding.default.padding.left || "0";
      return {
        style: "margin-top: " + marginTop + "px; " + "margin-right: " + marginRight + "px; " + "margin-bottom: " + marginBottom + "px; " + "margin-left: " + marginLeft + "px; " + "padding-top: " + paddingTop + "px; " + "padding-right: " + paddingRight + "px; " + "padding-bottom: " + paddingBottom + "px; " + "padding-left: " + paddingLeft + "px;"
      };
    };
    /**
     * Get the banner content for the storefront
     *
     * @returns {any}
     */


    _proto.getContentHtml = function getContentHtml() {
      var data = this.getData();

      if (data.message === "" || data.message === undefined) {
        return;
      } else {
        return (0, _translate)(data.message);
      }
    };
    /**
     * Get the desktop (main) image attributes for the render
     *
     * @returns {any}
     */


    _proto.getImage = function getImage() {
      var data = this.getData();

      if (data.image === "" || data.image === undefined) {
        return {};
      }

      if (_underscore.isEmpty(data.image[0])) {
        return;
      }

      return Banner.getImageUrl(data.image);
    };
    /**
     * Get the mobile image attributes for the render
     *
     * @returns {any}
     */


    _proto.getMobileImage = function getMobileImage() {
      var data = this.getData();

      if (data.mobile_image === "" || data.mobile_image === undefined) {
        return {};
      }

      if (_underscore.isEmpty(data.mobile_image[0])) {
        return;
      }

      return Banner.getImageUrl(data.mobile_image);
    };
    /**
     * Convert HEX to RGBA for transparent overlay for the preview
     *
     * @returns {string}
     */


    _proto.convertHexToRgba = function convertHexToRgba() {
      var data = this.getData();

      if (data.overlay_color !== "" && data.overlay_color !== undefined) {
        var colors = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.overlay_color);
        var red = parseInt(colors[1], 16);
        var green = parseInt(colors[2], 16);
        var blue = parseInt(colors[3], 16);

        var alpha = _conversion.convertPercentToDecimal(data.overlay_transparency);

        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
      } else {
        return "transparent";
      }
    };

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
