/*eslint-disable */
define(["jquery", "uiEvents"], function (_jquery, _uiEvents) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var _default = {
    /**
     * Set state based on toolbar focusin event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    onToolbarFocusIn: function onToolbarFocusIn(context, event) {
      var currentContentTypeTarget = event.currentTarget.closest(".pagebuilder-content-type");
      (0, _jquery)(currentContentTypeTarget).addClass("pagebuilder-toolbar-active");

      _uiEvents.trigger("stage:interactionStart");
    },

    /**
     * Set state based on toolbar focusout event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    onToolbarFocusOut: function onToolbarFocusOut(context, event) {
      var currentContentTypeTarget = event.currentTarget.closest(".pagebuilder-content-type");
      (0, _jquery)(currentContentTypeTarget).removeClass("pagebuilder-toolbar-active");

      _uiEvents.trigger("stage:interactionStop");
    }
  };
  return _default;
});
//# sourceMappingURL=toolbar.js.map
