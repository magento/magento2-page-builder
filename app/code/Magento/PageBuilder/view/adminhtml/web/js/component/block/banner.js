/*eslint-disable */
define(["mage/translate", "underscore", "../../utils/color-converter", "../../utils/directives", "../../utils/number-converter", "../config", "./block"], function (_translate, _underscore, _colorConverter, _directives, _numberConverter, _config, _block) {
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
     * Get the banner wrapper styles for the storefront
     *
     * @returns {any}
     */
    _proto.getBannerStyles = function getBannerStyles(type) {
      var data = this.getData();
      var backgroundImage = "";

      if (type === "image") {
        backgroundImage = this.getImage() ? this.getStyle().backgroundImage : "none";
      }

      if (type === "mobileImage") {
        if (this.getMobileImage()) {
          backgroundImage = this.getStyle().mobileImage;
        } else {
          if (this.getImage()) {
            backgroundImage = this.getStyle().backgroundImage;
          } else {
            backgroundImage = "none";
          }
        }
      }

      return {
        backgroundImage: backgroundImage,
        backgroundSize: data.background_size
      };
    };
    /**
     * Get the banner overlay attributes for the storefront
     *
     * @returns {any}
     */


    _proto.getOverlayAttributes = function getOverlayAttributes() {
      var data = this.getData();
      var overlayColorAttr = "transparent";

      if (data.show_overlay !== "never_show") {
        if (data.overlay_color !== "" && data.overlay_color !== undefined) {
          overlayColorAttr = (0, _colorConverter.fromHex)(data.overlay_color, (0, _numberConverter.percentToDecimal)(data.overlay_transparency));
        }
      }

      return {
        "data-overlay-color": overlayColorAttr
      };
    };
    /**
     * Get the banner overlay styles for the storefront
     *
     * @returns {any}
     */


    _proto.getOverlayStyles = function getOverlayStyles() {
      var data = this.getData();
      var paddingTop = data.margins_and_padding.padding.top || "0";
      var paddingRight = data.margins_and_padding.padding.right || "0";
      var paddingBottom = data.margins_and_padding.padding.bottom || "0";
      var paddingLeft = data.margins_and_padding.padding.left || "0";
      return {
        backgroundColor: this.getOverlayColorStyle().backgroundColor,
        boxSizing: "border-box",
        minHeight: data.min_height + "px",
        paddingBottom: paddingBottom + "px",
        paddingLeft: paddingLeft + "px",
        paddingRight: paddingRight + "px",
        paddingTop: paddingTop + "px"
      };
    };
    /**
     * Get the overlay color style only for the storefront
     *
     * @returns {any}
     */


    _proto.getOverlayColorStyle = function getOverlayColorStyle() {
      var data = this.getData();
      var overlayColor = "transparent";

      if (data.show_overlay === "always" && data.overlay_color !== "" && data.overlay_color !== undefined) {
        overlayColor = (0, _colorConverter.fromHex)(data.overlay_color, (0, _numberConverter.percentToDecimal)(data.overlay_transparency));
      }

      return {
        backgroundColor: overlayColor
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

      if (data.background_image === "" || data.background_image === undefined) {
        return {};
      }

      if (_underscore.isEmpty(data.background_image[0])) {
        return;
      }

      return (0, _directives.getImageUrl)(data.background_image, _config.getInitConfig("media_url"));
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

      return (0, _directives.getImageUrl)(data.mobile_image, _config.getInitConfig("media_url"));
    };

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
