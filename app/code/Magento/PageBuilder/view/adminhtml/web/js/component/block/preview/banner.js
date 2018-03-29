/*eslint-disable */
define(["knockout", "mage/translate", "Magento_PageBuilder/js/utils/color-converter", "Magento_PageBuilder/js/utils/number-converter", "Magento_PageBuilder/js/component/block/preview/block"], function (_knockout, _translate, _colorConverter, _numberConverter, _block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Banner =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Banner, _PreviewBlock);

    /**
     * Banner constructor
     *
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    function Banner(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.showOverlayHover = _knockout.observable(false);
      _this.showButtonHover = _knockout.observable(false);
      _this.buttonPlaceholder = (0, _translate)("Edit Button Text");
      return _this;
    }
    /**
     * Get the banner wrapper attributes for the preview
     *
     * @returns {any}
     */


    var _proto = Banner.prototype;

    _proto.getBackgroundStyles = function getBackgroundStyles() {
      var backgroundImage = "none";

      if (this.data.background_image && this.data.background_image() !== "" && this.data.background_image() !== undefined && this.data.background_image()[0] !== undefined) {
        backgroundImage = "url(" + this.data.background_image()[0].url + ")";
      }

      return {
        backgroundImage: backgroundImage,
        backgroundSize: this.data.background_size(),
        minHeight: this.data.min_height() ? this.data.min_height() + "px" : "300px",
        paddingBottom: "",
        paddingLeft: "",
        paddingRight: "",
        paddingTop: ""
      };
    };
    /**
     * Get the banner overlay attributes for the preview
     *
     * @returns {any}
     */


    _proto.getOverlayStyles = function getOverlayStyles() {
      var paddingTop = this.data.margins_and_padding().padding.top || "0";
      var paddingRight = this.data.margins_and_padding().padding.right || "0";
      var paddingBottom = this.data.margins_and_padding().padding.bottom || "0";
      var paddingLeft = this.data.margins_and_padding().padding.left || "0";
      return {
        backgroundColor: this.getOverlayColorStyle().backgroundColor,
        minHeight: this.data.min_height() ? this.data.min_height() + "px" : "300px",
        paddingBottom: paddingBottom + "px",
        paddingLeft: paddingLeft + "px",
        paddingRight: paddingRight + "px",
        paddingTop: paddingTop + "px"
      };
    };
    /**
     * Get the overlay background style for the preview
     *
     * @returns {any}
     */


    _proto.getOverlayColorStyle = function getOverlayColorStyle() {
      var overlayColor = "transparent";

      if (this.data.show_overlay() === "always" || this.showOverlayHover()) {
        if (this.data.overlay_color() !== "" && this.data.overlay_color() !== undefined) {
          var colors = this.data.overlay_color();
          var alpha = (0, _numberConverter.percentToDecimal)(this.data.overlay_transparency());
          overlayColor = (0, _colorConverter.fromHex)(colors, alpha);
        } else {
          overlayColor = "transparent";
        }
      }

      return {
        backgroundColor: overlayColor
      };
    };
    /**
     * Is there content in the WYSIWYG?
     *
     * @returns {boolean}
     */


    _proto.isContentEmpty = function isContentEmpty() {
      return this.data.message() === "" || this.data.message() === undefined;
    };
    /**
     * Get the content for the preview
     *
     * @returns {any}
     */


    _proto.getContentHtml = function getContentHtml() {
      if (this.isContentEmpty()) {
        return (0, _translate)("Edit banner text");
      } else {
        return (0, _translate)(this.data.message());
      }
    };
    /**
     * Get the button text for the preview
     *
     * @returns {any}
     */


    _proto.getButtonStyles = function getButtonStyles() {
      var buttonStyle = {
        opacity: "0",
        visibility: "hidden"
      };

      if (this.data.show_button() === "always" || this.showButtonHover()) {
        buttonStyle.opacity = "1";
        buttonStyle.visibility = "visible";
      }

      return buttonStyle;
    };

    var _proto = Banner.prototype;

    /**
     * Set state based on overlay mouseover event for the preview
     */
    _proto.onMouseOverWrapper = function onMouseOverWrapper() {
      if (this.data.main.attributes()["data-show-overlay"] === "on_hover") {
        this.data.overlay.attributes(Object.assign(this.data.overlay.attributes(), {
          "data-background-color-orig": this.data.overlay.style().backgroundColor
        }));
        this.data.overlay.style(Object.assign(this.data.overlay.style(), {
          backgroundColor: this.data.overlay.attributes()["data-overlay-color"]
        }));
      }

      if (this.data.main.attributes()["data-show-button"] === "on_hover") {
        this.data.button.style(Object.assign(this.data.button.style(), {
          opacity: 1,
          visibility: "visible"
        }));
      }
    };
    /**
     * Set state based on overlay mouseout event for the preview
     */


    _proto.onMouseOutWrapper = function onMouseOutWrapper() {
      if (this.data.main.attributes()["data-show-overlay"] === "on_hover") {
        this.data.overlay.style(Object.assign(this.data.overlay.style(), {
          backgroundColor: this.data.overlay.attributes()["data-background-color-orig"]
        }));
      }

      if (this.data.main.attributes()["data-show-button"] === "on_hover") {
        this.data.button.style(Object.assign(this.data.button.style(), {
          opacity: 0,
          visibility: "hidden"
        }));
      }
    };

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
