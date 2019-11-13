/*eslint-disable */
/* jscs:disable */

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jarallax", "jquery", "knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/resource/resize-observer/ResizeObserver", "underscore", "Magento_PageBuilder/js/content-type-menu/conditional-remove-option", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/content-type/preview-collection"], function (_jarallax, _jquery, _knockout, _events, _ResizeObserver, _underscore, _conditionalRemoveOption, _hideShowOption, _previewCollection) {
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

    /**
     * Debounce and defer the init of Jarallax
     *
     * @type {(() => void) & _.Cancelable}
     */

    /**
     * @param {ContentTypeInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(contentType, config, observableUpdater) {
      var _this;

      _this = _previewCollection2.call(this, contentType, config, observableUpdater) || this;
      _this.wrapClass = _knockout.observable(false);
      _this.buildJarallax = _underscore.debounce(function () {
        // Destroy all instances of the plugin prior
        try {
          // store/apply correct style after destroying, as jarallax incorrectly overrides it with stale value
          var style = _this.element.getAttribute("data-jarallax-original-styles") || _this.element.getAttribute("style");

          jarallax(_this.element, "destroy");

          _this.element.setAttribute("style", style);
        } catch (e) {// Failure of destroying is acceptable
        }

        if (_this.element && (0, _jquery)(_this.element).hasClass("jarallax") && _this.contentType.dataStore.get("background_image").length) {
          _underscore.defer(function () {
            // Build Parallax on elements with the correct class
            var parallaxSpeed = Number.parseFloat(_this.contentType.dataStore.get("parallax_speed"));
            jarallax(_this.element, {
              imgPosition: _this.contentType.dataStore.get("background_position") || "50% 50%",
              imgRepeat: _this.contentType.dataStore.get("background_repeat") || "no-repeat",
              imgSize: _this.contentType.dataStore.get("background_size") || "cover",
              speed: !isNaN(parallaxSpeed) ? parallaxSpeed : 0.5
            });
            jarallax(_this.element, "onResize");
          });
        }
      }, 50);

      _this.contentType.dataStore.subscribe(_this.buildJarallax);

      _events.on("row:mountAfter", function (args) {
        if (args.id === _this.contentType.id) {
          _this.buildJarallax();
        }
      });

      _events.on("contentType:mountAfter", function (args) {
        if (args.contentType.parentContentType && args.contentType.parentContentType.id === _this.contentType.id) {
          _this.buildJarallax();
        }
      });

      _events.on("stage:" + _this.contentType.stageId + ":fullScreenModeChangeAfter", function () {
        _underscore.delay(function () {
          _this.buildJarallax();
        }, 350);
      });

      return _this;
    }
    /**
     * Use the conditional remove to disable the option when the content type has a single child
     *
     * @returns {OptionsInterface}
     */


    var _proto = Preview.prototype;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _previewCollection2.prototype.retrieveOptions.call(this);

      options.remove = new _conditionalRemoveOption(_extends({}, options.remove.config, {
        preview: this
      }));
      options.hideShow = new _hideShowOption({
        preview: this,
        icon: _hideShowOption.showIcon,
        title: _hideShowOption.showText,
        action: this.onOptionVisibilityToggle,
        classes: ["hide-show-content-type"],
        sort: 40
      });
      return options;
    }
    /**
     * Init the parallax element
     *
     * @param {Element} element
     */
    ;

    _proto.initParallax = function initParallax(element) {
      var _this2 = this;

      this.element = element;

      _underscore.defer(function () {
        _this2.buildJarallax();
      });

      new _ResizeObserver(function () {
        // Observe for resizes of the element and force jarallax to display correctly
        if ((0, _jquery)(_this2.element).hasClass("jarallax") && _this2.contentType.dataStore.get("background_image").length) {
          jarallax(_this2.element, "onResize");
          jarallax(_this2.element, "onScroll");
        }
      }).observe(this.element);
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map