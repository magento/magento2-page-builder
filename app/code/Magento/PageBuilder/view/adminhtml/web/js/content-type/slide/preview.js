/*eslint-disable */
define(["jquery", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/resource/slick/slick.min", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/uploader", "Magento_PageBuilder/js/content-type/wysiwyg/factory"], function (_jquery, _translate, _events, _slick, _config, _option, _preview, _uploader, _factory) {
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
     * The textarea element in disabled mode
     */

    /**
     * The element the text content type is bound to
     */

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
      _this.wysiwyg = void 0;
      _this.textarea = void 0;
      _this.element = void 0;
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
     * @param {HTMLElement} element
     */


    var _proto = Preview.prototype;

    _proto.initWysiwyg = function initWysiwyg(element) {
      var _this2 = this;

      this.element = element;
      element.id = this.parent.id + "-editor";
      (0, _factory)(this.parent.id, element.id, this.config.name, this.config.additional_data.wysiwygConfig.wysiwygConfigData, this.parent.dataStore, "content").then(function (wysiwyg) {
        _this2.wysiwyg = wysiwyg;
      });
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
      var _this3 = this;

      var options = _BasePreview.prototype.retrieveOptions.call(this);

      var newOptions = options.filter(function (option) {
        return option.code !== "remove";
      });
      var removeClasses = ["remove-structural"];

      var removeFn = function removeFn() {
        var index = _this3.parent.parent.getChildren().indexOf(_this3.parent);

        _this3.onOptionRemove(); // Invoking methods on slider


        _this3.parent.parent.onAfterRender();

        _this3.parent.parent.setFocusedSlide(index - 1);
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
     * Makes WYSIWYG active
     */


    _proto.activateEditor = function activateEditor() {
      if (this.element) {
        this.element.focus();
      }

      if (this.textarea) {
        this.textarea.focus();
      }
    };
    /**
     * @returns {Boolean}
     */


    _proto.isWysiwygSupported = function isWysiwygSupported() {
      return _config.getConfig("can_use_inline_editing_on_stage");
    };
    /**
     * @param {HTMLTextAreaElement} element
     */


    _proto.initTextarea = function initTextarea(element) {
      var _this4 = this;

      this.textarea = element; // set initial value of textarea based on data store

      this.textarea.value = this.parent.dataStore.get("content");
      this.adjustTextareaHeightBasedOnScrollHeight(); // Update content in our stage preview textarea after its slideout counterpart gets updated

      _events.on("form:" + this.parent.id + ":saveAfter", function () {
        _this4.textarea.value = _this4.parent.dataStore.get("content");

        _this4.adjustTextareaHeightBasedOnScrollHeight();
      });
    };
    /**
     * Save current value of textarea in data store
     */


    _proto.onTextareaKeyUp = function onTextareaKeyUp() {
      this.adjustTextareaHeightBasedOnScrollHeight();
      this.parent.dataStore.update(this.textarea.value, "content");
    };
    /**
     * Start stage interaction on textarea blur
     */


    _proto.onTextareaFocus = function onTextareaFocus() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStart");
    };
    /**
     * Stop stage interaction on textarea blur
     */


    _proto.onTextareaBlur = function onTextareaBlur() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStop");
    };
    /**
     * @inheritDoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this5 = this;

      _BasePreview.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.parent.id + ":updateAfter", function () {
        var dataStore = _this5.parent.dataStore.get();

        var imageObject = dataStore[_this5.config.additional_data.uploaderConfig.dataScope][0] || {};

        _events.trigger("image:" + _this5.parent.id + ":assignAfter", imageObject);
      });

      _events.on(this.config.name + ":mountAfter", function () {
        var dataStore = _this5.parent.dataStore.get();

        var initialImageValue = dataStore[_this5.config.additional_data.uploaderConfig.dataScope] || ""; // Create uploader

        _this5.uploader = new _uploader("imageuploader_" + _this5.parent.id, _this5.config.additional_data.uploaderConfig, _this5.parent.id, _this5.parent.dataStore, initialImageValue);
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
     * Adjust textarea's height based on scrollHeight
     */


    _proto.adjustTextareaHeightBasedOnScrollHeight = function adjustTextareaHeightBasedOnScrollHeight() {
      this.textarea.style.height = "";
      var scrollHeight = this.textarea.scrollHeight;
      var minHeight = parseInt((0, _jquery)(this.textarea).css("min-height"), 10);

      if (scrollHeight === minHeight) {
        // leave height at 'auto'
        return;
      }

      (0, _jquery)(this.textarea).height(scrollHeight);
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
