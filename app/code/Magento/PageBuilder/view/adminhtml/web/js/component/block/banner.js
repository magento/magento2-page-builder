/*eslint-disable */
define(["mage/translate", "underscore", "../../utils/color-converter", "../../utils/directives", "../../utils/number-converter", "./block"], function (_translate, _underscore, _colorConverter, _directives, _numberConverter, _block) {
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
      var overlayColorAttr = "transparent";
      var overlayColor = "transparent";

      if (data.show_overlay !== "never_show") {
        if (data.overlay_color !== "" && data.overlay_color !== undefined) {
          overlayColorAttr = (0, _colorConverter.fromHex)(data.overlay_color, (0, _numberConverter.percentToDecimal)(data.overlay_transparency));
        }
      }

      if (data.show_overlay === "always" && data.overlay_color !== "" && data.overlay_color !== undefined) {
        overlayColor = (0, _colorConverter.fromHex)(data.overlay_color, (0, _numberConverter.percentToDecimal)(data.overlay_transparency));
      }

      return {
        "data-overlay-color": overlayColorAttr,
        "style": "min-height: " + data.minimum_height + "px; background-color: " + overlayColor + ";"
      };
    };
    /**
     * Get the banner content attributes for the storefront
     *
     * @returns {any}
     */


    _proto.getContentAttributes = function getContentAttributes() {
      var data = this.getData();
      var paddingTop = data.margins_and_padding.padding.top || "0";
      var paddingRight = data.margins_and_padding.padding.right || "0";
      var paddingBottom = data.margins_and_padding.padding.bottom || "0";
      var paddingLeft = data.margins_and_padding.padding.left || "0";
      return {
        style: "padding-top: " + paddingTop + "px; " + "padding-right: " + paddingRight + "px; " + "padding-bottom: " + paddingBottom + "px; " + "padding-left: " + paddingLeft + "px;"
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

      return (0, _directives.getImageUrl)(data.image);
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

      return (0, _directives.getImageUrl)(data.mobile_image);
    };

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
