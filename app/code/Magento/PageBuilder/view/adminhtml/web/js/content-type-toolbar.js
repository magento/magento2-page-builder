/*eslint-disable */
/* jscs:disable */

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(["jquery", "knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/utils/check-stage-full-screen", "Magento_PageBuilder/js/utils/pagebuilder-header-height", "Magento_PageBuilder/js/utils/promise-deferred"], function (_jquery, _knockout, _events, _checkStageFullScreen, _pagebuilderHeaderHeight, _promiseDeferred) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Toolbar = /*#__PURE__*/function () {
    "use strict";

    /**
     * Toolbar Options constructor
     *
     * @param preview
     * @param options
     */
    function Toolbar(preview, options) {
      this.options = _knockout.observableArray([]);
      this.afterRenderDeferred = (0, _promiseDeferred)();
      this.preview = preview;
      this.options(options);
    }
    /**
     * Toolbar template
     *
     * @returns {string}
     */


    var _proto = Toolbar.prototype;

    /**
     * On render init the toolbar
     *
     * @param {Element} element
     */
    _proto.afterRender = function afterRender(element) {
      this.element = element;
      this.afterRenderDeferred.resolve(element);
    }
    /**
     * Upon clicking the option update the value as directed
     * When user toggles the option off, set the value back to default
     *
     * @param {OptionInterface} option
     * @param {ValueInterface} value
     */
    ;

    _proto.onOptionClick = function onOptionClick(option, value) {
      var appearance = this.preview.appearance() + "-appearance";
      var fields = this.preview.config.fields[appearance] || this.preview.config.fields.default;
      var defaultValue = fields[option.key].default;
      var currentValue = this.preview.contentType.dataStore.get(option.key);
      this.preview.updateData(option.key, currentValue === value.value ? defaultValue : value.value);
    }
    /**
     * Set state based on toolbar focusin event for the preview
     *
     * @param {ContentTypeToolbarPreviewInterface} context
     * @param {Event} event
     */
    ;

    _proto.onFocusIn = function onFocusIn(context, event) {
      var currentContentTypeTarget = context.toolbar.getCurrentContentTypeTarget();
      var toolbarOptions = currentContentTypeTarget.find(".pagebuilder-toolbar-options");
      var currentContentTypeTargetClientRectTop = currentContentTypeTarget[0].getBoundingClientRect().top - (0, _pagebuilderHeaderHeight)(context.contentType.stageId); // Change toolbar orientation if overflow on full screen mode

      if ((0, _checkStageFullScreen)(context.contentType.stageId) && currentContentTypeTargetClientRectTop < toolbarOptions.outerHeight()) {
        context.toolbar.observer = new MutationObserver(function () {
          toolbarOptions.css("transform", "translateY(" + currentContentTypeTarget.outerHeight() + "px)");
        });
        context.toolbar.observer.observe(currentContentTypeTarget[0], {
          attributes: true,
          childList: true,
          subtree: true
        });
        toolbarOptions.css("transform", "translateY(" + currentContentTypeTarget.outerHeight() + "px)");
      } else {
        toolbarOptions.css("transform", "translateY(-100%)");
      }

      (0, _jquery)(currentContentTypeTarget).addClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStart");
    }
    /**
     * Set state based on toolbar focusout event for the preview
     *
     * @param {ContentTypeToolbarPreviewInterface} context
     * @param {Event} event
     */
    ;

    _proto.onFocusOut = function onFocusOut(context, event) {
      var currentContentTypeTarget = context.toolbar.getCurrentContentTypeTarget();
      currentContentTypeTarget.removeClass("pagebuilder-toolbar-active");
      currentContentTypeTarget.find(".pagebuilder-toolbar-options").css("transform", "");

      if (typeof context.toolbar.observer !== "undefined") {
        context.toolbar.observer.disconnect();
      }

      _events.trigger("stage:interactionStop");
    }
    /**
     * Get fixed toolbar container element referenced as selector in wysiwyg adapter settings
     *
     * @returns {jQuery}
     */
    ;

    _proto.getCurrentContentTypeTarget = function getCurrentContentTypeTarget() {
      return (0, _jquery)("#" + this.preview.contentType.id).find(".pagebuilder-content-type");
    };

    _createClass(Toolbar, [{
      key: "template",
      get: function get() {
        return "Magento_PageBuilder/content-type-toolbar";
      }
    }]);

    return Toolbar;
  }();
  /**
   * Preview interface for preview instances implementation the toolbar functionality
   */


  return Toolbar;
});
//# sourceMappingURL=content-type-toolbar.js.map