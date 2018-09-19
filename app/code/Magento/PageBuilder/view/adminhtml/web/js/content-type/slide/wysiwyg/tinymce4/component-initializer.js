/*eslint-disable */
define(["jquery", "mage/adminhtml/wysiwyg/events"], function (_jquery, _events) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ComponentInitializer =
  /*#__PURE__*/
  function () {
    function ComponentInitializer() {
      Object.defineProperty(this, "$element", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "config", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "sliderTransform", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "sliderSelector", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: ".slick-list"
      });
      Object.defineProperty(this, "sliderContentSelector", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: ".slick-track"
      });
      Object.defineProperty(this, "slideSelector", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: ".slick-slide"
      });
      Object.defineProperty(this, "activeSlideSelector", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: ".slick-current"
      });
      Object.defineProperty(this, "autoplay", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
    }

    var _proto = ComponentInitializer.prototype;

    /**
     * Initialize the instance
     *
     * @param {Wysiwyg} wysiwyg
     */
    _proto.initialize = function initialize(wysiwyg) {
      this.$element = (0, _jquery)("#" + wysiwyg.elementId);
      this.config = wysiwyg.config;
      var tinymce = wysiwyg.getAdapter();
      tinymce.eventBus.attachEventHandler(_events.afterFocus, this.onFocus.bind(this));
      tinymce.eventBus.attachEventHandler(_events.afterBlur, this.onBlur.bind(this));
    };
    /**
     * Event handler for wysiwyg focus
     * Fixes z-index issues for tabs and column
     * Fixes slider
     */


    _proto.onFocus = function onFocus() {
      var _this = this;

      var $slider = (0, _jquery)(this.$element.parents(this.sliderSelector));
      var sliderContent = this.$element.parents(this.sliderContentSelector)[0];
      var $notActiveSlides = $slider.find(this.slideSelector).not(this.activeSlideSelector);

      _jquery.each(this.config.adapter_config.parentSelectorsToUnderlay, function (i, selector) {
        _this.$element.closest(selector).css("z-index", 100);
      }); // Disable slider keyboard events and fix problem with overflow hidden issue


      (0, _jquery)($slider.parent()).slick("slickSetOption", "accessibility", false);
      this.autoplay = (0, _jquery)($slider.parent()).slick("slickGetOption", "autoplay");

      if (this.autoplay) {
        (0, _jquery)($slider.parent()).slick("slickPause");
      }

      $notActiveSlides.hide();
      this.sliderTransform = sliderContent.style.transform;
      sliderContent.style.transform = "";
      $slider.css("overflow", "visible");
    };
    /**
     * Event handler for wysiwyg blur
     * Fixes z-index issues for tabs and column
     * Fixes slider
     */


    _proto.onBlur = function onBlur() {
      var _this2 = this;

      var $slider = (0, _jquery)(this.$element.parents(this.sliderSelector));
      var sliderContent = this.$element.parents(this.sliderContentSelector)[0];
      var $notActiveSlides = $slider.find(this.slideSelector).not(this.activeSlideSelector);

      _jquery.each(this.config.adapter_config.parentSelectorsToUnderlay, function (i, selector) {
        _this2.$element.closest(selector).css("z-index", "");
      }); // Enable slider keyboard events and revert changes made in onFocus


      $slider.css("overflow", "hidden");
      sliderContent.style.transform = this.sliderTransform;
      $notActiveSlides.show();
      (0, _jquery)($slider.parent()).slick("slickSetOption", "accessibility", true);

      if (this.autoplay) {
        (0, _jquery)($slider.parent()).slick("slickPlay");
      }
    };

    return ComponentInitializer;
  }();

  return ComponentInitializer;
});
//# sourceMappingURL=component-initializer.js.map
