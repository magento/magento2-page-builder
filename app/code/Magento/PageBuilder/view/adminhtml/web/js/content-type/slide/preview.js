/*eslint-disable */
/* jscs:disable */

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jarallax", "jarallaxVideo", "jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "mageUtils", "underscore", "vimeoWrapper", "Magento_PageBuilder/js/content-type-menu/conditional-remove-option", "Magento_PageBuilder/js/uploader", "Magento_PageBuilder/js/utils/delay-until", "Magento_PageBuilder/js/utils/editor", "Magento_PageBuilder/js/utils/nesting-link-dialog", "Magento_PageBuilder/js/utils/nesting-widget-dialog", "Magento_PageBuilder/js/wysiwyg/factory", "Magento_PageBuilder/js/content-type/preview"], function (_jarallax, _jarallaxVideo, _jquery, _knockout, _translate, _events, _mageUtils, _underscore, _vimeoWrapper, _conditionalRemoveOption, _uploader, _delayUntil, _editor, _nestingLinkDialog, _nestingWidgetDialog, _factory, _preview) {
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
      _this.videoUpdateProperties = ["background_type", "video_fallback_image", "video_lazy_load", "video_loop", "video_play_only_visible", "video_source"];
      _this.buildJarallax = _underscore.debounce(function () {
        // Destroy all instances of the plugin prior
        try {
          jarallax(_this.wrapper, "destroy");
        } catch (e) {// Failure of destroying is acceptable
        }

        if (_this.wrapper && _this.wrapper.dataset.backgroundType === "video" && _this.wrapper.dataset.videoSrc.length) {
          _underscore.defer(function () {
            // Build Parallax on elements with the correct class
            var viewportElement = (0, _jquery)("<div/>").addClass("jarallax-viewport-element");
            (0, _jquery)(_this.wrapper).append((0, _jquery)(".jarallax-viewport-element", _this.wrapper).length ? "" : viewportElement);
            jarallax(_this.wrapper, {
              videoSrc: _this.wrapper.dataset.videoSrc,
              imgSrc: _this.wrapper.dataset.videoFallbackSrc,
              videoLoop: _this.contentType.dataStore.get("video_loop") === "true",
              speed: 1,
              videoPlayOnlyVisible: _this.contentType.dataStore.get("video_play_only_visible") === "true",
              elementInViewport: (0, _jquery)(".jarallax-viewport-element", _this.wrapper),
              videoLazyLoading: _this.contentType.dataStore.get("video_lazy_load") === "true"
            }); // @ts-ignore

            if (_this.wrapper.jarallax && _this.wrapper.jarallax.video) {
              // @ts-ignore
              _this.wrapper.jarallax.video.on("started", function () {
                // @ts-ignore
                if (_this.wrapper.jarallax && _this.wrapper.jarallax.$video) {
                  // @ts-ignore
                  _this.wrapper.jarallax.$video.style.visibility = "visible";
                }
              });
            }
          });
        }
      }, 50);
      return _this;
    }

    var _proto = Preview.prototype;

    /**
     * Get background image url base on the viewport.
     *
     * @returns {string}
     */
    _proto.getBackgroundImage = function getBackgroundImage() {
      var mobileImage = this.contentType.dataStore.get("mobile_image");
      var desktopImage = this.contentType.dataStore.get("background_image");
      var backgroundImage = this.viewport() === "mobile" && mobileImage.length ? mobileImage : desktopImage;
      return backgroundImage.length ? "url(\"" + backgroundImage[0].url + "\")" : "none";
    }
    /**
     * @param {HTMLElement} element
     */
    ;

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

        wysiwygConfig.adapter.settings.init_instance_callback = function (editor) {
          editor.on("blur", function () {
            (0, _nestingLinkDialog)(_this6.contentType.dataStore, _this6.wysiwyg, "content", "link_url");
            (0, _nestingWidgetDialog)(_this6.contentType.dataStore, _this6.wysiwyg, "content", "link_url");
          });

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
     * Init the parallax element
     *
     * @param {HTMLElement} element
     */
    ;

    _proto.initParallax = function initParallax(element) {
      var _this7 = this;

      this.wrapper = element;

      _underscore.defer(function () {
        _this7.buildJarallax();
      });
    }
    /**
     * Destroy jarallax instance.
     */
    ;

    _proto.destroy = function destroy() {
      _preview2.prototype.destroy.call(this);

      if (this.wrapper) {
        jarallax(this.wrapper, "destroy");
      }
    }
    /**
     * @inheritDoc
     */
    ;

    _proto.bindEvents = function bindEvents() {
      var _this8 = this;

      _preview2.prototype.bindEvents.call(this);

      _events.on("slide:mountAfter", function (args) {
        if (args.id === _this8.contentType.id) {
          _this8.buildJarallax();

          _this8.isSnapshot.subscribe(function (value) {
            _this8.changeUploaderControlsVisibility();
          });

          _this8.changeUploaderControlsVisibility();
        }
      });

      _events.on(this.config.name + ":" + this.contentType.id + ":updateAfter", function () {
        var dataStore = _this8.contentType.dataStore.getState();

        var imageObject = dataStore[_this8.config.additional_data.uploaderConfig.dataScope][0] || {};

        _events.trigger("image:" + _this8.contentType.id + ":assignAfter", imageObject);
      }); // Remove wysiwyg before assign new instance.


      _events.on("childContentType:sortUpdate", function (args) {
        if (args.instance.id === _this8.contentType.parentContentType.id) {
          _this8.wysiwyg = null;
        }
      });

      _events.on(this.config.name + ":mountAfter", function (args) {
        if (args.id === _this8.contentType.id) {
          // Update the display label for the slide
          var slider = _this8.contentType.parentContentType;

          _this8.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this8.contentType) + 1)));

          slider.children.subscribe(function (children) {
            var index = children.indexOf(_this8.contentType);

            _this8.displayLabel((0, _translate)("Slide " + (slider.children().indexOf(_this8.contentType) + 1)));
          });
        }
      });

      _events.on(this.config.name + ":renderAfter", function (args) {
        if (args.id === _this8.contentType.id) {
          var slider = _this8.contentType.parentContentType;
          (0, _jquery)(slider.preview.element).on("beforeChange", function () {
            _this8.slideChanged = false;
          });
          (0, _jquery)(slider.preview.element).on("afterChange", function (event, slick) {
            (0, _jquery)(slick.$slides).each(function (index, slide) {
              var videoSlide = slide.querySelector(".jarallax");

              if (videoSlide) {
                jarallax(videoSlide, "onScroll");
              }
            });
            _this8.slideChanged = true;
          });
        }
      });

      this.contentType.dataStore.subscribe(function (data) {
        _this8.slideName(data.slide_name);

        if (_this8.shouldUpdateVideo(data)) {
          _this8.buildJarallax();
        }
      });

      _events.on("image:" + this.contentType.id + ":uploadAfter", function () {
        _this8.contentType.dataStore.set("background_type", "image");
      });

      _events.on("stage:" + this.contentType.stageId + ":viewportChangeAfter", function (args) {
        if (_this8.contentType.dataStore.get("background_type") === "video") {
          _this8.buildJarallax();
        }
      });
    }
    /**
     * Change uploader controls visibility
     */
    ;

    _proto.changeUploaderControlsVisibility = function changeUploaderControlsVisibility() {
      var _this9 = this;

      this.getUploader().getUiComponent()(function (uploader) {
        uploader.visibleControls = !_this9.isSnapshot();
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
    }
    /**
     * Check if video options has been updated.
     *
     * @return boolean
     */
    ;

    _proto.shouldUpdateVideo = function shouldUpdateVideo(state) {
      var _this10 = this;

      var previousState = this.contentType.dataStore.getPreviousState();

      var diff = _mageUtils.compare(previousState, state).changes;

      if (diff.length > 0) {
        return _underscore.some(diff, function (element) {
          if (element.name === "video_fallback_image") {
            return (!_underscore.isEmpty(previousState.video_fallback_image) && previousState.video_fallback_image) !== (!_underscore.isEmpty(state.video_fallback_image) && state.video_fallback_image);
          }

          return _this10.videoUpdateProperties.indexOf(element.name) !== -1;
        });
      }
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map