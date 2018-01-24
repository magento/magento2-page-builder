/*eslint-disable */
define(["underscore", "mage/translate", "../config", "./block"], function (_underscore, _translate, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Banner =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Banner, _Block);

    function Banner() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Banner.prototype;

    /**
     * Get the banner wrapper attributes for the storefront
     *
     * @returns {any}
     */
    _proto.getBannerAttributes = function getBannerAttributes(type) {
      var data = this.getData();
      var backgroundImage = "";

      if (type === 'image') {
        backgroundImage = this.getImage() ? "url(" + this.getImage() + ")" : "none";
      } else if (type === 'mobileImage') {
        backgroundImage = this.getMobileImage() ? "url(" + this.getMobileImage() + ")" : "none";
      }

      return {
        style: "background-image: " + backgroundImage + "; min-height: " + data.minimum_height + "px; background-size: " + data.background_size + ";"
      };
    };
    /**
     * Get the banner overlay attributes for the storefront
     *
     * @returns {any}
     */


    _proto.getOverlayAttributes = function getOverlayAttributes() {
      var data = this.getData();
      var backgroundColor = data.show_overlay === "never_show" ? "transparent" : this.convertHexToRgba();
      return {
        style: "min-height: " + data.minimum_height + "px; background-color: " + backgroundColor + ";"
      };
    };
    /**
     * Convert HEX to RGBA for transparent overlay for the preview
     *
     * @returns {string}
     */


    _proto.convertHexToRgba = function convertHexToRgba() {
      var data = this.getData();

      if (data.overlay_color !== "" && data.overlay_color !== undefined) {
        var colors = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.overlay_color),
            red = parseInt(colors[1], 16),
            green = parseInt(colors[2], 16),
            blue = parseInt(colors[3], 16),
            alpha = this.convertPercentToDecimal(data.overlay_transparency);
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
     * Get the banner content attributes for the storefront
     *
     * @returns {any}
     */


    _proto.getContentAttributes = function getContentAttributes() {
      var data = this.getData();
      var marginTop = data.fields.margins_and_padding.default.margin.top || "0",
          marginRight = data.fields.margins_and_padding.default.margin.right || "0",
          marginBottom = data.fields.margins_and_padding.default.margin.bottom || "0",
          marginLeft = data.fields.margins_and_padding.default.margin.left || "0",
          paddingTop = data.fields.margins_and_padding.default.padding.top || "0",
          paddingRight = data.fields.margins_and_padding.default.padding.right || "0",
          paddingBottom = data.fields.margins_and_padding.default.padding.bottom || "0",
          paddingLeft = data.fields.margins_and_padding.default.padding.left || "0";
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

      return this.getImageUrl(data.image);
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

      return this.getImageUrl(data.mobile_image);
    };
    /**
     * Retrieve the image URL with directive
     *
     * @param {Array} image
     * @returns {string}
     */


    _proto.getImageUrl = function getImageUrl(image) {
      var imageUrl = image[0].url;

      var mediaUrl = _config.getInitConfig("media_url");

      var mediaPath = imageUrl.split(mediaUrl);
      var directive = "{{media url=" + mediaPath[1] + "}}";
      return directive;
    };

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
