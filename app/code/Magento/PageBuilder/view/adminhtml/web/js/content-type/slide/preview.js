/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/uploader"], function (_translate, _events, _option, _preview, _uploader) {
  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
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
     * Get the background wrapper attributes for the preview
     *
     * @returns {any}
     */


    var _proto = Preview.prototype;

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
      var _this2 = this;

      var options = _BasePreview.prototype.retrieveOptions.call(this);

      var newOptions = options.filter(function (option) {
        return option.code !== "remove";
      });
      var removeClasses = ["remove-structural"];

      var removeFn = function removeFn() {
        var index = _this2.parent.parent.getChildren().indexOf(_this2.parent);

        _this2.onOptionRemove(); // Invoking methods on slider


        _this2.parent.parent.onAfterRender();

        _this2.parent.parent.setFocusedSlide(index - 1);
      };

      if (this.parent.parent.children().length <= 1) {
        removeFn = function removeFn() {
          return;
        };

        removeClasses.push("disabled");
      }

      newOptions.push(new _option(this, "remove", "<i class='icon-admin-pagebuilder-remove'></i>", (0, _translate)("Remove"), removeFn, removeClasses, 100));
      return newOptions;
    };
    /**
     * @inheritDoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this3 = this;

      _BasePreview.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.parent.id + ":updateAfter", function () {
        var dataStore = _this3.parent.dataStore.get();

        var imageObject = dataStore[_this3.config.additional_data.uploaderConfig.dataScope][0] || {};

        _events.trigger("image:" + _this3.parent.id + ":assignAfter", imageObject);
      });

      _events.on(this.config.name + ":mountAfter", function () {
        var dataStore = _this3.parent.dataStore.get();

        var initialImageValue = dataStore[_this3.config.additional_data.uploaderConfig.dataScope] || ""; // Create uploader

        _this3.uploader = new _uploader("imageuploader_" + _this3.parent.id, _this3.config.additional_data.uploaderConfig, _this3.parent.id, _this3.parent.dataStore, initialImageValue);
      });
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
