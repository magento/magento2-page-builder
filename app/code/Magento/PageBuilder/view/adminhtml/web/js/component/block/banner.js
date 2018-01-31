/*eslint-disable */
define(["mage/translate", "underscore", "../../utils/colors", "../config", "./block", "../../utils/numbers", "../format/style-attribute-mapper"], function (_translate, _underscore, _colors, _config, _block, _numbers, _styleAttributeMapper) {
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
          bgColorAttr = _colors.colorConverter(data.overlay_color, _numbers.convertPercentToDecimal(data.overlay_transparency));
        } else {
          bgColorAttr = "transparent";
        }
      }

      if (data.show_overlay === "never_show" || data.show_overlay === "on_hover") {
        bgColor = "transparent";
      } else {
        if (data.overlay_color !== "" && data.overlay_color !== undefined) {
          bgColor = _colors.colorConverter(data.overlay_color, _numbers.convertPercentToDecimal(data.overlay_transparency));
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
      var styleMapper = new _styleAttributeMapper();
      var toDomPadding = styleMapper.toDom(this.getData().fields.margins_and_padding.default.padding);
      return {
        style: "padding-top: " + toDomPadding.top + "px; " + "padding-right: " + toDomPadding.right + "px; " + "padding-bottom: " + toDomPadding.bottom + "px; " + "padding-left: " + toDomPadding.left + "px;"
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

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
