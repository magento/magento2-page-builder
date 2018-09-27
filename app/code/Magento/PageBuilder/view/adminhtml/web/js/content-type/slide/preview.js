/*eslint-disable */
define(["jquery", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-menu/conditional-remove-option", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/uploader", "Magento_PageBuilder/js/content-type/wysiwyg/factory"], function (_jquery, _translate, _events, _config, _conditionalRemoveOption, _preview, _uploader, _factory) {
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
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this;
      _this.buttonPlaceholder = (0, _translate)("Edit Button Text");
      _this.slideChanged = true;
      return _this;
    }

    var _proto = Preview.prototype;

    /**
     * @param {HTMLElement} element
     */
    _proto.initWysiwyg = function initWysiwyg(element) {
      var _this2 = this;

      this.element = element;
      element.id = this.parent.id + "-editor";
      (0, _factory)(this.parent.id, element.id, this.config.name, this.config.additional_data.wysiwygConfig.wysiwygConfigData, this.parent.dataStore, "content").then(function (wysiwyg) {
        _this2.wysiwyg = wysiwyg;
      });
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
     * @returns {OptionsInterface}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      var options = _BasePreview.prototype.retrieveOptions.call(this);

      delete options.move;
      options.remove = new _conditionalRemoveOption(_extends({}, options.remove.config, {
        preview: this
      }));
      return options;
    };
    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */


    _proto.getUploader = function getUploader() {
      var dataStore = this.parent.dataStore.get();
      var initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || ""; // Create uploader

      return new _uploader("imageuploader_" + this.parent.id, this.config.additional_data.uploaderConfig, this.parent.id, this.parent.dataStore, initialImageValue);
    };
    /**
     * Makes WYSIWYG active
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     * @returns {Boolean}
     */


    _proto.activateEditor = function activateEditor(preview, event) {
      var element = this.wysiwyg && this.element || this.textarea;

      if (!element || !this.slideChanged || event.currentTarget !== event.target && event.target !== element && !element.contains(event.target)) {
        return false;
      }

      element.focus();
    };
    /**
     * Stop event to prevent execution of action when editing textarea.
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     * @returns {Boolean}
     */


    _proto.stopEvent = function stopEvent(preview, event) {
      event.stopPropagation();
      return true;
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
      var _this3 = this;

      this.textarea = element; // set initial value of textarea based on data store

      this.textarea.value = this.parent.dataStore.get("content");
      this.adjustTextareaHeightBasedOnScrollHeight(); // Update content in our stage preview textarea after its slideout counterpart gets updated

      _events.on("form:" + this.parent.id + ":saveAfter", function () {
        _this3.textarea.value = _this3.parent.dataStore.get("content");

        _this3.adjustTextareaHeightBasedOnScrollHeight();
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
      var _this4 = this;

      _BasePreview.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.parent.id + ":updateAfter", function () {
        var dataStore = _this4.parent.dataStore.get();

        var imageObject = dataStore[_this4.config.additional_data.uploaderConfig.dataScope][0] || {};

        _events.trigger("image:" + _this4.parent.id + ":assignAfter", imageObject);
      }); // Remove wysiwyg before assign new instance.


      _events.on("childContentType:sortUpdate", function (args) {
        if (args.instance.id === _this4.parent.parent.id) {
          _this4.wysiwyg = null;
        }
      });

      _events.on(this.config.name + ":mountAfter", function (args) {
        if (args.id === _this4.parent.id) {
          // Update the display label for the slide
          var slider = _this4.parent.parent;

          _this4.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this4.parent) + 1)));

          slider.children.subscribe(function (children) {
            var index = children.indexOf(_this4.parent);

            _this4.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this4.parent) + 1)));
          });
        }
      });

      _events.on(this.config.name + ":renderAfter", function (args) {
        if (args.id === _this4.parent.id) {
          var slider = _this4.parent.parent;
          (0, _jquery)(slider.preview.element).on("beforeChange", function () {
            _this4.slideChanged = false;
          });
          (0, _jquery)(slider.preview.element).on("afterChange", function () {
            _this4.slideChanged = true;
          });
        }
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

  return Object.assign(Preview, {
    __esModule: true
  });
});
//# sourceMappingURL=preview.js.map
