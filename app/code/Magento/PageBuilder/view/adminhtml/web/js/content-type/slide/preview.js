/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/uploader"], function (_translate, _events, _preview, _uploader) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.buttonPlaceholder = (0, _translate)("Edit Button Text"), _this.uploader = void 0, _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * Get the background wrapper attributes for the preview
     *
     * @returns {any}
     */
    _proto.getBackgroundStyles = function getBackgroundStyles() {
      var desktopStyles = this.data.desktop_image.style();
      return _extends({}, desktopStyles, {
        paddingBottom: "",
        paddingLeft: "",
        paddingRight: "",
        paddingTop: "",
        borderStyle: "none",
        borderRadius: "0px"
      });
    };
    /**
     * Get the slide wrapper attributes for the preview
     *
     * @returns {any}
     */


    _proto.getPaddingStyles = function getPaddingStyles() {
      var previewData = this.previewData;
      var appearance = this.data.main.attributes()["data-appearance"];
      var paddingData = {};

      switch (appearance) {
        case "collage-centered":
          paddingData.paddingLeft = "calc(25% + " + this.data.desktop_image.style().paddingLeft + ")";
          paddingData.paddingRight = "calc(25% + " + this.data.desktop_image.style().paddingRight + ")";
          break;

        case "collage-left":
          paddingData.paddingRight = "calc(50% + " + this.data.desktop_image.style().paddingRight + ")";
          break;

        case "collage-right":
          paddingData.paddingLeft = "calc(50% + " + this.data.desktop_image.style().paddingLeft + ")";
          break;

        default:
          break;
      }

      var backgroundImage = "none";

      if (previewData.background_image() && previewData.background_image() !== "" && previewData.background_image() !== undefined && previewData.background_image()[0] !== undefined) {
        backgroundImage = "url(" + previewData.background_image()[0].url + ")";
      }

      var styles = {
        backgroundImage: backgroundImage,
        backgroundSize: previewData.background_size(),
        minHeight: previewData.min_height() ? previewData.min_height() + "px" : "300px",
        overflow: "hidden",
        paddingBottom: this.data.desktop_image.style().paddingBottom || "",
        paddingLeft: this.data.desktop_image.style().paddingLeft || "",
        paddingRight: this.data.desktop_image.style().paddingRight || "",
        paddingTop: this.data.desktop_image.style().paddingTop || ""
      };
      return _extends({}, styles, paddingData);
    };
    /**
     * Set state based on overlay mouseover event for the preview
     */


    _proto.onMouseOverWrapper = function onMouseOverWrapper() {
      // Triggers the visibility of the overlay content to show
      if (this.data.main.attributes()["data-show-overlay"] === "hover") {
        this.data.overlay.attributes(Object.assign(this.data.overlay.attributes(), {
          "data-background-color-orig": this.data.overlay.style().backgroundColor
        }));
        this.data.overlay.style(Object.assign(this.data.overlay.style(), {
          backgroundColor: this.data.overlay.attributes()["data-overlay-color"]
        }));
      }

      if (this.data.main.attributes()["data-show-button"] === "hover") {
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
      // Triggers the visibility of the overlay content to hide
      if (this.data.main.attributes()["data-show-overlay"] === "hover") {
        this.data.overlay.style(Object.assign(this.data.overlay.style(), {
          backgroundColor: this.data.overlay.attributes()["data-background-color-orig"]
        }));
      }

      if (this.data.main.attributes()["data-show-button"] === "hover") {
        this.data.button.style(Object.assign(this.data.button.style(), {
          opacity: 0,
          visibility: "hidden"
        }));
      }
    };
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
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */


    _proto.getUploader = function getUploader() {
      return this.uploader;
    };
    /**
     * @inheritDoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.parent.id + ":updateAfter", function () {
        var dataStore = _this2.parent.dataStore.get();

        var imageObject = dataStore[_this2.config.additional_data.uploaderConfig.dataScope][0] || {};

        _events.trigger("image:" + _this2.parent.id + ":assignAfter", imageObject);
      });

      _events.on(this.config.name + ":mountAfter", function (args) {
        if (args.id === _this2.parent.id) {
          var dataStore = _this2.parent.dataStore.get();

          var initialImageValue = dataStore[_this2.config.additional_data.uploaderConfig.dataScope] || ""; // Create uploader

          _this2.uploader = new _uploader(_this2.parent.id, "imageuploader_" + _this2.parent.id, Object.assign({}, _this2.config.additional_data.uploaderConfig, {
            value: initialImageValue
          })); // Register listener when image gets uploaded from uploader UI component

          _this2.uploader.onUploaded(_this2.onImageUploaded.bind(_this2)); // Update remove action to call methods on slider


          var removeOption = _this2.getOptions().getOption("remove");

          removeOption.setAction(function () {
            var index = _this2.parent.parent.getChildren().indexOf(_this2.parent);

            _this2.onOptionRemove(); // Invoking methods on slider


            _this2.parent.parent.preview.onAfterRender();

            _this2.parent.parent.preview.setFocusedSlide(index - 1);
          });

          if (_this2.parent.parent.children().length < 2) {
            removeOption.is_disabled(true);
          }

          _this2.parent.parent.children.subscribe(function (children) {
            removeOption.is_disabled(children.length < 2);
          }); // Update the display label for the slide


          var slider = _this2.parent.parent;

          _this2.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this2.parent) + 1)));

          slider.children.subscribe(function (children) {
            var index = children.indexOf(_this2.parent);

            _this2.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this2.parent) + 1)));
          });
        }
      });
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
