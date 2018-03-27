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
     * @param {object} config
     */
    function Banner(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.showOverlayHover = _knockout.observable(false);
      _this.showButtonHover = _knockout.observable(false);
      _this.buttonText = void 0;
      _this.buttonPlaceholder = (0, _translate)("Edit Button Text");
      _this.buttonText = _this.data.button_text;

      _this.buttonText.subscribe(_this.onButtonTextChange.bind(_this));

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
    /**
     * Set state based on overlay mouseover event for the preview
     */


    _proto.onMouseOverWrapper = function onMouseOverWrapper() {
      if (this.preview.data.show_overlay() === "on_hover") {
        this.preview.showOverlayHover(true);
      }

      if (this.preview.data.show_button() === "on_hover") {
        this.preview.showButtonHover(true);
      }
    };
    /**
     * Set state based on overlay mouseout event for the preview
     */


    _proto.onMouseOutWrapper = function onMouseOutWrapper() {
      if (this.preview.data.show_overlay() === "on_hover") {
        this.preview.showOverlayHover(false);
      }

      if (this.preview.data.show_button() === "on_hover") {
        this.preview.showButtonHover(false);
      }
    };
    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */


    _proto.afterStyleMapped = function afterStyleMapped(styles) {
      // Extract data values our of observable functions
      // The style attribute mapper converts images to directives, override it to include the correct URL
      if (this.data.background_image && _typeof(this.data.background_image()[0]) === "object") {
        styles.backgroundImage = "url(" + this.data.background_image()[0].url + ")";
      }

      if (_typeof(this.data.mobile_image) && this.data.mobile_image() !== "" && _typeof(this.data.mobile_image()[0]) === "object") {
        styles.mobileImage = "url(" + this.data.mobile_image()[0].url + ")";
      }

      return styles;
    };
    /**
     * Update store on banner button text listener
     *
     * @param {string} value
     */


    _proto.onButtonTextChange = function onButtonTextChange(value) {
      var data = this.parent.stage.store.get(this.parent.id);
      data.button_text = value;
      this.parent.stage.store.update(this.parent.id, data);
    };

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
