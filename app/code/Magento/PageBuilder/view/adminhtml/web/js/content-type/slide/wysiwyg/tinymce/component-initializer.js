/*eslint-disable */
/* jscs:disable */
define(["jquery", "mage/adminhtml/wysiwyg/events", "Magento_PageBuilder/js/utils/delay-until"], function (_jquery, _events, _delayUntil) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ComponentInitializer = /*#__PURE__*/function () {
    "use strict";

    function ComponentInitializer() {
      this.sliderSelector = ".slick-list";
      this.sliderContentSelector = ".slick-track";
      this.slideSelector = ".slick-slide";
      this.activeSlideSelector = ".slick-current";
      this.slideChanging = false;
    }

    var _proto = ComponentInitializer.prototype;

    /**
     * Initialize the instance
     *
     * @param {Wysiwyg} wysiwyg
     */
    _proto.initialize = function initialize(wysiwyg) {
      var _this = this;

      this.$element = (0, _jquery)("#" + wysiwyg.elementId);
      this.config = wysiwyg.config;
      var tinymce = wysiwyg.getAdapter();
      tinymce.eventBus.attachEventHandler(_events.afterFocus, this.onFocus.bind(this));
      tinymce.eventBus.attachEventHandler(_events.afterBlur, this.onBlur.bind(this)); // Update our KO pointer to the active slide on change

      (0, _jquery)(this.$element.parents(this.sliderSelector)).parent().on("beforeChange", function () {
        _this.slideChanging = true;
      }).on("afterChange", function () {
        _this.slideChanging = false;
      });
    }
    /**
     * Event handler for wysiwyg focus
     * Fixes z-index issues for tabs and column
     * Fixes slider
     */
    ;

    _proto.onFocus = function onFocus() {
      var _this2 = this;

      var $slider = (0, _jquery)(this.$element.parents(this.sliderSelector));
      var sliderContent = this.$element.parents(this.sliderContentSelector)[0];
      var $notActiveSlides = $slider.find(this.slideSelector).not(this.activeSlideSelector); // If there isn't enough room for a left-aligned toolbar, right align it

      if ((0, _jquery)(window).width() < this.$element.offset().left + parseInt(this.config.adapter_config.minToolbarWidth, 10)) {
        this.$element.addClass("_right-aligned-toolbar");
      } else {
        this.$element.removeClass("_right-aligned-toolbar");
      }

      (0, _delayUntil)(function () {
        _jquery.each(_this2.config.adapter_config.parentSelectorsToUnderlay, function (i, selector) {
          _this2.$element.closest(selector).css("z-index", 100);
        }); // Disable slider keyboard events and fix problem with overflow hidden issue


        $slider.parent().slick("slickSetOption", "accessibility", false);
        _this2.autoplay = $slider.parent().slick("slickGetOption", "autoplay");
        _this2.fade = $slider.parent().slick("slickGetOption", "fade");

        if (_this2.autoplay) {
          $slider.parent().slick("slickPause");
        }

        if (!_this2.fade) {
          $notActiveSlides.css("display", "none");
        }

        _this2.sliderTransform = sliderContent.style.transform;
        sliderContent.style.transform = "";
        $slider.css("overflow", "visible");
      }, function () {
        return !_this2.slideChanging;
      }, 10);
    }
    /**
     * Event handler for wysiwyg blur
     * Fixes z-index issues for tabs and column
     * Fixes slider
     */
    ;

    _proto.onBlur = function onBlur() {
      var _this3 = this;

      var $slider = (0, _jquery)(this.$element.parents(this.sliderSelector));
      var sliderContent = this.$element.parents(this.sliderContentSelector)[0];
      var $notActiveSlides = $slider.find(this.slideSelector).not(this.activeSlideSelector);

      _jquery.each(this.config.adapter_config.parentSelectorsToUnderlay, function (i, selector) {
        _this3.$element.closest(selector).css("z-index", "");
      }); // Enable slider keyboard events and revert changes made in onFocus


      $slider.css("overflow", "hidden");
      sliderContent.style.transform = this.sliderTransform;
      $notActiveSlides.css("display", "block");
      $slider.parent().slick("slickSetOption", "accessibility", true);

      if (this.autoplay) {
        $slider.parent().slick("slickPlay");
      }
    };

    return ComponentInitializer;
  }();

  return ComponentInitializer;
});
//# sourceMappingURL=component-initializer.js.map