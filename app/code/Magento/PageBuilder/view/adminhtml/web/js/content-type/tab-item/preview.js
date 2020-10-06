/*eslint-disable */
/* jscs:disable */

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jquery", "knockout", "Magento_PageBuilder/js/content-type-menu/conditional-remove-option", "Magento_PageBuilder/js/content-type/preview-collection", "underscore", "Magento_PageBuilder/js/events"], function (_jquery, _knockout, _conditionalRemoveOption, _previewCollection, _underscore, _events) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_previewCollection2) {
    "use strict";

    _inheritsLoose(Preview, _previewCollection2);

    function Preview() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _previewCollection2.call.apply(_previewCollection2, [this].concat(args)) || this;
      _this.fieldsToIgnoreOnRemove = ["tab_name"];
      _this.buildJarallax = _underscore.debounce(function () {
          // Destroy all instances of the plugin prior
          try {
              // store/apply correct style after destroying, as jarallax incorrectly overrides it with stale value
              var style = _this.wrapper.getAttribute("style") || _this.wrapper.getAttribute("data-jarallax-original-styles");

              var backgroundImage = _this.getBackgroundImage();

              jarallax(_this.wrapper, "destroy");

              _this.wrapper.setAttribute("style", style);

              if (_this.contentType.dataStore.get("background_type") !== "video" && _this.wrapper.style.backgroundImage !== backgroundImage && backgroundImage !== "none") {
                  _this.wrapper.style.backgroundImage = backgroundImage;
              }
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
    };

    /**
     * Force the focus on the clicked tab header
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */
    _proto.onClick = function onClick(index, event) {
      (0, _jquery)(event.currentTarget).find("[contenteditable]").focus();
      event.stopPropagation();
    }
    /**
     * On focus in set the focused button
     *
     * @param {number} index
     * @param {Event} event
     */
    ;

    _proto.onFocusIn = function onFocusIn(index, event) {
      var parentPreview = this.contentType.parentContentType.preview;

      if (parentPreview.focusedTab() !== index) {
        parentPreview.setFocusedTab(index, true);
      }
    }
    /**
     * On focus out set the focused tab to null
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */
    ;

    _proto.onFocusOut = function onFocusOut(index, event) {
      if (this.contentType && this.contentType.parentContentType) {
        var parentPreview = this.contentType.parentContentType.preview;

        var unfocus = function unfocus() {
          window.getSelection().removeAllRanges();
          parentPreview.focusedTab(null);
        };

        if (event.relatedTarget && _jquery.contains(parentPreview.wrapperElement, event.relatedTarget)) {
          // Verify the focus was not onto the options menu
          if ((0, _jquery)(event.relatedTarget).closest(".pagebuilder-options").length > 0) {
            unfocus();
          } else {
            // Have we moved the focus onto another button in the current group?
            var tabItem = _knockout.dataFor(event.relatedTarget);

            if (tabItem && tabItem.contentType && tabItem.contentType.parentContentType && tabItem.contentType.parentContentType.id === this.contentType.parentContentType.id) {
              var newIndex = tabItem.contentType.parentContentType.children().indexOf(tabItem.contentType);
              parentPreview.setFocusedTab(newIndex, true);
            } else {
              unfocus();
            }
          }
        } else if (parentPreview.focusedTab() === index) {
          unfocus();
        }
      }
    }
    /**
     * Get the options instance
     *
     * @returns {OptionsInterface}
     */
    ;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _previewCollection2.prototype.retrieveOptions.call(this);

      delete options.move;
      delete options.title;
      options.remove = new _conditionalRemoveOption(_extends({}, options.remove.config, {
        preview: this
      }));
      return options;
    }
    /**
     * @inheritDoc
     */
    ;

    _proto.bindEvents = function bindEvents() {
        var _this = this;

        _previewCollection2.prototype.bindEvents.call(this);

        _events.on("stage:" + this.contentType.stageId + ":viewportChangeAfter", function (args) {
            if (_this.contentType.dataStore.get("background_type") !== "video") {
                _this.buildJarallax();
            }
        });
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
