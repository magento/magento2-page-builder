/*eslint-disable */
/* jscs:disable */

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/content-type-menu/conditional-remove-option", "Magento_PageBuilder/js/uploader", "Magento_PageBuilder/js/utils/delay-until", "Magento_PageBuilder/js/utils/editor", "Magento_PageBuilder/js/utils/nesting-link-dialog", "Magento_PageBuilder/js/wysiwyg/factory", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _events, _underscore, _conditionalRemoveOption, _uploader, _delayUntil, _editor, _nestingLinkDialog, _factory, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_preview2) {
    "use strict";

    _inheritsLoose(Preview, _preview2);

    function Preview() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _preview2.call.apply(_preview2, [this].concat(args)) || this;
      _this.buttonPlaceholder = (0, _translate)("Edit Button Text");
      _this.slideName = _knockout.observable();
      _this.wysiwygDeferred = _jquery.Deferred();
      _this.slideChanged = true;
      _this.handledDoubleClick = false;
      return _this;
    }

    var _proto = Preview.prototype;

    /**
     * @param {HTMLElement} element
     */
    _proto.afterRenderWysiwyg = function afterRenderWysiwyg(element) {
      var _this2 = this;

      this.element = element;
      element.id = this.contentType.id + "-editor"; // Set the innerHTML manually so we don't upset Knockout & TinyMCE

      element.innerHTML = this.data.content.html();
      this.contentType.dataStore.subscribe(function () {
        // If we're not focused into TinyMCE inline, update the value when it changes in the data store
        if (!_this2.wysiwyg || _this2.wysiwyg && _this2.wysiwyg.getAdapter().id !== (0, _editor.getActiveEditor)().id) {
          element.innerHTML = _this2.data.content.html();
        }
      }, "content");
      /**
       * afterRenderWysiwyg is called whenever Knockout causes a DOM re-render. This occurs frequently within Slider
       * due to Slick's inability to perform a refresh with Knockout managing the DOM. Due to this the original
       * WYSIWYG instance will be detached from this slide and we need to re-initialize on click.
       */

      this.wysiwyg = null;
    }
    /**
     * Set state based on overlay mouseover event for the preview
     */
    ;

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
    }
    /**
     * Set state based on overlay mouseout event for the preview
     */
    ;

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
    }
    /**
     * Get the options instance
     *
     * @returns {OptionsInterface}
     */
    ;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _preview2.prototype.retrieveOptions.call(this);

      delete options.move;
      options.remove = new _conditionalRemoveOption(_extends({}, options.remove.config, {
        preview: this
      }));
      return options;
    }
    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */
    ;

    _proto.getUploader = function getUploader() {
      var initialImageValue = this.contentType.dataStore.get(this.config.additional_data.uploaderConfig.dataScope, ""); // Create uploader

      return new _uploader("imageuploader_" + this.contentType.id, this.config.additional_data.uploaderConfig, this.contentType.id, this.contentType.dataStore, initialImageValue);
    }
    /**
     * Makes WYSIWYG active
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     * @returns {Boolean}
     */
    ;

    _proto.activateEditor = function activateEditor(preview, event) {
      var _this3 = this;

      if (this.element && !this.wysiwyg) {
        var bookmark = (0, _editor.createBookmark)(event);
        (0, _editor.lockImageSize)(this.element);
        this.element.removeAttribute("contenteditable");

        _underscore.defer(function () {
          _this3.initWysiwygFromClick(true).then(function () {
            return (0, _delayUntil)(function () {
              // We no longer need to handle double click once it's initialized
              _this3.handledDoubleClick = true;

              _this3.wysiwygDeferred.resolve();

              (0, _editor.moveToBookmark)(bookmark);
              (0, _editor.unlockImageSize)(_this3.element);
            }, function () {
              return _this3.element.classList.contains("mce-edit-focus");
            }, 10);
          }).catch(function (error) {
            // If there's an error with init of WYSIWYG editor push into the console to aid support
            console.error(error);
          });
        });
      } else if (this.element && this.wysiwyg) {
        var element = this.element || this.textarea;

        if (event.currentTarget !== event.target && event.target !== element && !element.contains(event.target)) {
          return;
        }

        element.focus();
      }
    }
    /**
     * If a user double clicks prior to initializing TinyMCE, forward the event
     *
     * @param preview
     * @param event
     */
    ;

    _proto.handleDoubleClick = function handleDoubleClick(preview, event) {
      var _this4 = this;

      if (this.handledDoubleClick) {
        return;
      }

      event.preventDefault();
      var targetIndex = (0, _editor.findNodeIndex)(this.element, event.target.tagName, event.target);
      this.handledDoubleClick = true;
      this.wysiwygDeferred.then(function () {
        var target = document.getElementById(event.target.id);

        if (!target) {
          target = (0, _editor.getNodeByIndex)(_this4.element, event.target.tagName, targetIndex);
        }

        if (target) {
          target.dispatchEvent((0, _editor.createDoubleClickEvent)());
        }
      });
    }
    /**
     * Stop event to prevent execution of action when editing textarea.
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     * @returns {Boolean}
     */
    ;

    _proto.stopEvent = function stopEvent(preview, event) {
      event.stopPropagation();
      return true;
    }
    /**
     * @returns {Boolean}
     */
    ;

    _proto.isWysiwygSupported = function isWysiwygSupported() {
      return (0, _editor.isWysiwygSupported)();
    }
    /**
     * @param {HTMLTextAreaElement} element
     */
    ;

    _proto.initTextarea = function initTextarea(element) {
      var _this5 = this;

      this.textarea = element; // set initial value of textarea based on data store

      this.textarea.value = this.contentType.dataStore.get("content");
      this.adjustTextareaHeightBasedOnScrollHeight(); // Update content in our stage preview textarea after its slideout counterpart gets updated

      _events.on("form:" + this.contentType.id + ":saveAfter", function () {
        _this5.textarea.value = _this5.contentType.dataStore.get("content");

        _this5.adjustTextareaHeightBasedOnScrollHeight();
      });
    }
    /**
     * Save current value of textarea in data store
     */
    ;

    _proto.onTextareaKeyUp = function onTextareaKeyUp() {
      this.adjustTextareaHeightBasedOnScrollHeight();
      this.contentType.dataStore.set("content", this.textarea.value);
    }
    /**
     * Start stage interaction on textarea blur
     */
    ;

    _proto.onTextareaFocus = function onTextareaFocus() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStart");
    }
    /**
     * Stop stage interaction on textarea blur
     */
    ;

    _proto.onTextareaBlur = function onTextareaBlur() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStop");
    }
    /**
     * Init WYSIWYG on load
     *
     * @param element
     * @deprecated please use activateEditor & initWysiwygFromClick
     */
    ;

    _proto.initWysiwyg = function initWysiwyg(element) {
      this.element = element;
      element.id = this.contentType.id + "-editor";
      this.wysiwyg = null;
      return this.initWysiwygFromClick(true);
    }
    /**
     * Init the WYSIWYG
     *
     * @param {boolean} focus Should wysiwyg focus after initialization?
     * @returns Promise
     */
    ;

    _proto.initWysiwygFromClick = function initWysiwygFromClick(focus) {
      var _this6 = this;

      if (focus === void 0) {
        focus = false;
      }

      if (this.wysiwyg) {
        return Promise.resolve(this.wysiwyg);
      }

      var wysiwygConfig = this.config.additional_data.wysiwygConfig.wysiwygConfigData;

      if (focus) {
        wysiwygConfig.adapter.settings.auto_focus = this.element.id;

        wysiwygConfig.adapter.settings.init_instance_callback = function () {
          _underscore.defer(function () {
            _this6.element.blur();

            _this6.element.focus();
          });
        };
      }

      return (0, _factory)(this.contentType.id, this.element.id, this.config.name, wysiwygConfig, this.contentType.dataStore, "content", this.contentType.stageId).then(function (wysiwyg) {
        _this6.wysiwyg = wysiwyg;
        return wysiwyg;
      });
    }
    /**
     * @inheritDoc
     */
    ;

    _proto.bindEvents = function bindEvents() {
      var _this7 = this;

      _preview2.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.contentType.id + ":updateAfter", function () {
        var dataStore = _this7.contentType.dataStore.getState();

        var imageObject = dataStore[_this7.config.additional_data.uploaderConfig.dataScope][0] || {};

        _events.trigger("image:" + _this7.contentType.id + ":assignAfter", imageObject);

        (0, _nestingLinkDialog)(_this7.contentType.dataStore, _this7.wysiwyg, "content", "link_url");
      }); // Remove wysiwyg before assign new instance.


      _events.on("childContentType:sortUpdate", function (args) {
        if (args.instance.id === _this7.contentType.parentContentType.id) {
          _this7.wysiwyg = null;
        }
      });

      _events.on(this.config.name + ":mountAfter", function (args) {
        if (args.id === _this7.contentType.id) {
          // Update the display label for the slide
          var slider = _this7.contentType.parentContentType;

          _this7.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this7.contentType) + 1)));

          slider.children.subscribe(function (children) {
            var index = children.indexOf(_this7.contentType);

            _this7.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this7.contentType) + 1)));
          });
        }
      });

      _events.on(this.config.name + ":renderAfter", function (args) {
        if (args.id === _this7.contentType.id) {
          var slider = _this7.contentType.parentContentType;
          (0, _jquery)(slider.preview.element).on("beforeChange", function () {
            _this7.slideChanged = false;
          });
          (0, _jquery)(slider.preview.element).on("afterChange", function () {
            _this7.slideChanged = true;
          });
        }
      });

      this.contentType.dataStore.subscribe(function (data) {
        _this7.slideName(data.slide_name);
      });
    }
    /**
     * Update image data inside data store
     *
     * @param {Array} data - list of each files' data
     */
    ;

    _proto.onImageUploaded = function onImageUploaded(data) {
      this.contentType.dataStore.set(this.config.additional_data.uploaderConfig.dataScope, data);
    }
    /**
     * Adjust textarea's height based on scrollHeight
     */
    ;

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