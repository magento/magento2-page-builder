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
      var _data$margins_and_pad = data.margins_and_padding.padding,
          _data$margins_and_pad2 = _data$margins_and_pad.top,
          top = _data$margins_and_pad2 === void 0 ? 0 : _data$margins_and_pad2,
          _data$margins_and_pad3 = _data$margins_and_pad.right,
          right = _data$margins_and_pad3 === void 0 ? 0 : _data$margins_and_pad3,
          _data$margins_and_pad4 = _data$margins_and_pad.bottom,
          bottom = _data$margins_and_pad4 === void 0 ? 0 : _data$margins_and_pad4,
          _data$margins_and_pad5 = _data$margins_and_pad.left,
          left = _data$margins_and_pad5 === void 0 ? 0 : _data$margins_and_pad5;
      return {
        backgroundColor: this.getOverlayColorStyle().backgroundColor,
        boxSizing: "border-box",
        minHeight: data.min_height + "px",
        paddingBottom: bottom + "px",
        paddingLeft: left + "px",
        paddingRight: right + "px",
        paddingTop: top + "px"
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

      return (0, _directives.getImageUrl)(data.background_image);
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
    /**
     * Get the link attributes for the render
     *
     * @returns {any}
     */


    _proto.getLinkAttribute = function getLinkAttribute() {
      var data = this.getData();
      return {
        href: data.link_url,
        target: data.open_in_new_tab === "1" ? "_blank" : false
      };
    };
    /**
     * Get the button style for the render
     *
     * @returns {any}
     */


    _proto.getButtonStyle = function getButtonStyle() {
      var data = this.getData();
      return {
        opacity: data.show_button === "always" ? "1" : "0",
        visibility: data.show_button === "always" ? "visible" : "hidden"
      };
    };
    /**
     * Get collage container style only for the storefront
     *
     * @returns {any}
     */


    _proto.getCollageContainerStyle = function getCollageContainerStyle() {
      return Object.assign(this.getStyle(), {
        backgroundImage: "",
        minHeight: "",
        padding: "",
        paddingBottom: "",
        paddingLeft: "",
        paddingRight: "",
        paddingTop: ""
      });
    };
    /**
     * Get collage desktop image background style only for the storefront
     *
     * @returns {any}
     */


    _proto.getCollageDesktopBackgroundStyle = function getCollageDesktopBackgroundStyle(additionalStyle) {
      var style = this.getStyle();
      var data = this.getData();
      var baseStyle = {
        backgroundImage: style.backgroundImage,
        backgroundSize: style.backgroundSize,
        boxSizing: "border-box",
        minHeight: style.minHeight,
        paddingBottom: data.margins_and_padding.padding.bottom + "px",
        paddingLeft: data.margins_and_padding.padding.left + "px",
        paddingRight: data.margins_and_padding.padding.right + "px",
        paddingTop: data.margins_and_padding.padding.top + "px"
      };
      return Object.assign(baseStyle, additionalStyle);
    };
    /**
     * Get collage mobile image background style only for the storefront
     *
     * @returns {any}
     */


    _proto.getCollageMobileBackgroundStyle = function getCollageMobileBackgroundStyle() {
      var data = this.getStyle();
      return {
        backgroundImage: data.mobileImage && typeof data.mobileImage !== "undefined" && data.mobileImage.length !== 0 ? data.mobileImage : data.backgroundImage,
        boxSizing: "border-box",
        minHeight: data.minHeight,
        padding: data.padding
      };
    };

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
