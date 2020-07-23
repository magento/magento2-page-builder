/*eslint-disable */
/* jscs:disable */
define(["jquery", "mage/adminhtml/wysiwyg/events"], function (_jquery, _events) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ComponentInitializer =
  /*#__PURE__*/
  function () {
    "use strict";

    function ComponentInitializer() {}

    var _proto = ComponentInitializer.prototype;

    /**
     * The editor element
     */

    /**
     * The configuration of the wysiwyg content type
     */

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
    }
    /**
     * Called when tinymce is focused
     */
    ;

    _proto.onFocus = function onFocus() {
      var _this = this;

      // If there isn't enough room for a left-aligned toolbar, right align it
      if ((0, _jquery)(window).width() < this.$element.offset().left + parseInt(this.config.adapter_config.minToolbarWidth, 10)) {
        this.$element.addClass("_right-aligned-toolbar");
      } else {
        this.$element.removeClass("_right-aligned-toolbar");
      }

      _jquery.each(this.config.adapter_config.parentSelectorsToUnderlay, function (i, selector) {
        _this.$element.closest(selector).css("z-index", 100);
      });
    }
    /**
     * Called when tinymce is blurred
     */
    ;

    _proto.onBlur = function onBlur() {
      var _this2 = this;

      _jquery.each(this.config.adapter_config.parentSelectorsToUnderlay, function (i, selector) {
        _this2.$element.closest(selector).css("z-index", "");
      });
    };

    return ComponentInitializer;
  }();

  return ComponentInitializer;
});
//# sourceMappingURL=component-initializer.js.map