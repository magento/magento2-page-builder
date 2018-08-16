/*eslint-disable */
define(["jquery", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/resource/slick/slick.min", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/uploader", "Magento_PageBuilder/js/content-type/wysiwyg"], function (_jquery, _translate, _events, _slick, _config, _option, _preview, _uploader, _wysiwyg) {
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
     * Wysiwyg instance
     */

    /**
     * The element the text content type is bound to
     */

    /**
     * Uploader instance
     */

    /**
     * Slider transform
     */

    /**
     * Slider selector
     */

    /**
     * Slider content selector
     */

    /**
     * Slide selector
     */

    /**
     * Active slide selector
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
      _this.wysiwyg = void 0;
      _this.element = void 0;
      _this.uploader = void 0;
      _this.sliderTransform = void 0;
      _this.sliderSelector = ".slick-list";
      _this.sliderContentSelector = ".slick-track";
      _this.slideSelector = ".slick-slide";
      _this.activeSlideSelector = ".slick-current";
      var slider = _this.parent.parent;

      _this.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this.parent) + 1)));

      slider.children.subscribe(function (children) {
        var index = children.indexOf(_this.parent);

        _this.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this.parent) + 1)));
      });
      return _this;
    }
    /**
     * @param {HTMLElement} element
     */


    var _proto = Preview.prototype;

    _proto.initWysiwyg = function initWysiwyg(element) {
      if (!_config.getConfig("can_use_inline_editing_on_stage")) {
        return;
      } // TODO: Temporary solution, blocked by other team. Move configuration override to correct place.


      this.config.additional_data.wysiwygConfig.wysiwygConfigData.adapter.settings.fixed_toolbar_container = ".wysiwyg-container";
      this.element = element;
      element.id = this.parent.id + "-editor";
      this.wysiwyg = new _wysiwyg(this.parent.id, element.id, this.config.additional_data.wysiwygConfig.wysiwygConfigData, this.parent.dataStore);
      this.wysiwyg.onFocus(this.onFocus.bind(this));
      this.wysiwyg.onBlur(this.onBlur.bind(this));
    };
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
    /**
     * Event handler for wysiwyg focus
     * Fixes z-index issues for tabs and column
     */


    _proto.onFocus = function onFocus() {
      var $element = (0, _jquery)(this.element);
      var $slider = (0, _jquery)($element.parents(this.sliderSelector));
      var sliderContent = $element.parents(this.sliderContentSelector)[0];
      var $notActiveSlides = $slider.find(this.slideSelector).not(this.activeSlideSelector);

      _jquery.each(this.config.additional_data.wysiwygConfig.parentSelectorsToUnderlay, function (i, selector) {
        $element.closest(selector).css("z-index", 100);
      });

      (0, _jquery)($slider.parent()).slick("slickSetOption", "accessibility", false, true);
      $notActiveSlides.hide();
      this.sliderTransform = sliderContent.style.transform;
      sliderContent.style.transform = "";
      $slider.css("overflow", "visible");
    };
    /**
     * Event handler for wysiwyg blur
     * Fixes z-index issues for tabs and column
     */


    _proto.onBlur = function onBlur() {
      var $element = (0, _jquery)(this.element);
      var $slider = (0, _jquery)($element.parents(this.sliderSelector));
      var sliderContent = $element.parents(this.sliderContentSelector)[0];
      var $notActiveSlides = $slider.find(this.slideSelector).not(this.activeSlideSelector);

      _jquery.each(this.config.additional_data.wysiwygConfig.parentSelectorsToUnderlay, function (i, selector) {
        $element.closest(selector).css("z-index", "");
      });

      $slider.css("overflow", "hidden");
      sliderContent.style.transform = this.sliderTransform;
      $notActiveSlides.show();
      (0, _jquery)($slider.parent()).slick("slickSetOption", "accessibility", true, true);
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
