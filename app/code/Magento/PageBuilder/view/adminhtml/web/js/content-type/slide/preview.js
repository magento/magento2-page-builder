/*eslint-disable */
define(["uiEvents", "knockout", "mage/translate", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/utils/color-converter", "Magento_PageBuilder/js/utils/number-converter", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/uploader"], function (_uiEvents, _knockout, _translate, _option, _colorConverter, _numberConverter, _preview, _uploader) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    /**
     * Uploader instance
     */

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(parent, config, observableUpdater) {
      var _this;

      _this = _BasePreview.call(this, parent, config, observableUpdater) || this;
      _this.showOverlayHover = _knockout.observable(false);
      _this.showButtonHover = _knockout.observable(false);
      _this.buttonPlaceholder = (0, _translate)("Edit Button Text");
      _this.uploader = void 0;
      var slider = _this.parent.parent;

      _this.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this.parent) + 1)));

      slider.children.subscribe(function (children) {
        var index = children.indexOf(_this.parent);

        _this.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this.parent) + 1)));
      });
      return _this;
    }
    /**
     * Get the slide wrapper attributes for the preview
     *
     * @returns {any}
     */


    var _proto = Preview.prototype;

    _proto.getBackgroundStyles = function getBackgroundStyles() {
      var data = this.previewData;
      var backgroundImage = "none";

      if (data.background_image() && data.background_image() !== "" && data.background_image() !== undefined && data.background_image()[0] !== undefined) {
        backgroundImage = "url(" + data.background_image()[0].url + ")";
      }

      return {
        backgroundImage: backgroundImage,
        backgroundSize: data.background_size(),
        minHeight: data.min_height() ? data.min_height() + "px" : "300px",
        overflow: "hidden",
        paddingBottom: "",
        paddingLeft: "",
        paddingRight: "",
        paddingTop: ""
      };
    };
    /**
     * Get the slide overlay attributes for the preview
     *
     * @returns {any}
     */


    _proto.getOverlayStyles = function getOverlayStyles() {
      var data = this.previewData;
      var paddingTop = data.margins_and_padding().padding.top || "0";
      var paddingRight = data.margins_and_padding().padding.right || "0";
      var paddingBottom = data.margins_and_padding().padding.bottom || "0";
      var paddingLeft = data.margins_and_padding().padding.left || "0";
      return {
        backgroundColor: this.getOverlayColorStyle().backgroundColor,
        minHeight: data.min_height ? data.min_height() + "px" : "300px",
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
      var data = this.previewData;
      var overlayColor = "transparent";

      if (data.show_overlay() === "always" || this.showOverlayHover()) {
        if (data.overlay_color() !== "" && data.overlay_color() !== undefined) {
          var colors = data.overlay_color();
          var alpha = (0, _numberConverter.percentToDecimal)(data.overlay_transparency());
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
      var data = this.previewData.content();
      return data === "" || data === undefined;
    };
    /**
     * Get the content for the preview
     *
     * @returns {any}
     */


    _proto.getContentHtml = function getContentHtml() {
      if (this.isContentEmpty()) {
        return (0, _translate)("Edit slide text");
      } else {
        return (0, _translate)(this.previewData.content());
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

      if (this.previewData.show_button() === "always" || this.showButtonHover()) {
        buttonStyle.opacity = "1";
        buttonStyle.visibility = "visible";
      }

      return buttonStyle;
    };
    /**
     * Get the link href for preview
     *
     * @returns {String}
     */


    _proto.getHref = function getHref() {
      var href = "";

      if (!!this.previewData.link_url && _typeof(this.previewData.link_url()) === "object") {
        href = this.previewData.link_url()[this.previewData.link_url().type];
      }

      return href;
    };
    /**
     * Set state based on overlay mouseover event for the preview
     */


    _proto.onMouseOverWrapper = function onMouseOverWrapper() {
      if (this.previewData.show_overlay() === "on_hover") {
        this.showOverlayHover(true);
      }

      if (this.previewData.show_button() === "on_hover") {
        this.showButtonHover(true);
      }
    };
    /**
     * Set state based on overlay mouseout event for the preview
     */


    _proto.onMouseOutWrapper = function onMouseOutWrapper() {
      if (this.previewData.show_overlay() === "on_hover") {
        this.showOverlayHover(false);
      }

      if (this.previewData.show_button() === "on_hover") {
        this.showButtonHover(false);
      }
    };
    /**
     * Extract data values our of observable functions
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @param {StyleAttributeMapperResult} styles
     * @returns {StyleAttributeMapperResult}
     */

    /**
     * Get the options instance
     *
     * @returns {Options}
     */


    _proto.getOptions = function getOptions() {
      var options = _BasePreview.prototype.getOptions.call(this);

      options.removeOption("move");
      return options;
    };
    /**
     * Get the slide wrapper styles for the storefront
     *
     * @returns {object}
     */


    _proto.getSlideStyles = function getSlideStyles(type) {
      var data = this.previewData;

      var style = _.clone(this.getStyle());

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

      return Object.assign(style, {
        backgroundImage: backgroundImage,
        backgroundSize: data.background_size(),
        border: "",
        borderColor: "",
        borderRadius: "",
        borderWidth: "",
        marginBottom: "",
        marginLeft: "",
        marginRight: "",
        marginTop: "",
        paddingBottom: "",
        paddingLeft: "",
        paddingRight: "",
        paddingTop: ""
      });
    };
    /**
     * Get the slide overlay attributes for the storefront
     *
     * @returns {object}
     */


    _proto.getOverlayAttributes = function getOverlayAttributes() {
      var data = this.previewData;
      var overlayColorAttr = "transparent";

      if (data.show_overlay() !== "never_show") {
        if (data.overlay_color() !== "" && data.overlay_color() !== undefined) {
          overlayColorAttr = (0, _colorConverter.fromHex)(data.overlay_color(), (0, _numberConverter.percentToDecimal)(data.overlay_transparency()));
        }
      }

      return {
        "data-overlay-color": overlayColorAttr
      };
    };
    /**
     * @inheritDoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this);

      _uiEvents.on(this.parent.id + ":updated", function () {
        var imageDataStore = _this2.parent.dataStore.get();

        var imageObject = imageDataStore[_this2.config.additional_data.uploaderConfig.dataScope][0] || {};

        _uiEvents.trigger("image:assigned:" + _this2.parent.id, imageObject);
      });

      _uiEvents.on(this.config.name + ":block:ready", function () {
        var imageDataStore = _this2.parent.dataStore.get();

        var initialImageValue = imageDataStore[_this2.config.additional_data.uploaderConfig.dataScope] || ""; // Create uploader

        _this2.uploader = new _uploader(_this2.parent.id, "imageuploader_" + _this2.parent.id, Object.assign({}, _this2.config.additional_data.uploaderConfig, {
          value: initialImageValue
        })); // Register listener when image gets uploaded from uploader UI component

        _this2.uploader.onUploaded(_this2.onImageUploaded.bind(_this2));
      });
    };
    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */


    _proto.getUploader = function getUploader() {
      return this.uploader;
    };
    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      var options = _BasePreview.prototype.retrieveOptions.call(this);

      var newOptions = options.filter(function (option) {
        return option.code !== "remove";
      });
      var removeClasses = ["remove-structural"];
      var removeFn = this.onOptionRemove;

      if (this.parent.parent.children().length <= 1) {
        removeFn = function removeFn() {
          return;
        };

        removeClasses.push("disabled");
      }

      newOptions.push(new _option(this, "remove", "<i class='icon-admin-pagebuilder-remove'></i>", (0, _translate)("Remove"), removeFn, removeClasses, 100));
      return newOptions;
    };

    _proto.afterStyleMapped = function afterStyleMapped(styles) {
      // Extract data values our of observable functions
      // The style attribute mapper converts images to directives, override it to include the correct URL
      var data = this.previewData;

      if (data.background_image() && _typeof(data.background_image()[0]) === "object") {
        styles.backgroundImage = "url(" + data.background_image()[0].url + ")";
      }

      if (data.mobile_image() && data.mobile_image() !== "" && _typeof(data.mobile_image()[0]) === "object") {
        styles.mobileImage = "url(" + data.mobile_image()[0].url + ")";
      }

      return styles;
    };
    /**
     * Update image data inside data store
     *
     * @param {Array} data - list of each files' data
     */


    _proto.onImageUploaded = function onImageUploaded(data) {
      this.parent.dataStore.update(data, this.config.additional_data.uploaderConfig.dataScope);
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
