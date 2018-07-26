/*eslint-disable */
define(["jquery", "Magento_PageBuilder/js/events", "mage/adminhtml/wysiwyg/tiny_mce/setup"], function (_jquery, _events, _setup) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Wysiwyg =
  /*#__PURE__*/
  function () {
    /**
     * Wysiwyg adapter instance
     */

    /**
     * @param {String} id
     * @param {Object} config
     * @param {String} mode
     */
    function Wysiwyg(id, config, mode) {
      this.wysiwygAdapter = void 0;
      this.wysiwygAdapter = new _setup(id, config);

      if (mode) {
        this.wysiwygAdapter.setup(mode);
      }

      if (mode === "inline") {
        // prevent interactability with options when in inline editing mode
        this.onFocused(function () {
          (0, _jquery)("#" + id).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");

          _events.trigger("stage:interactionStart");
        }); // resume normal interactability with opens when leaving inline editing mode

        this.onBlurred(function () {
          window.getSelection().empty();
          (0, _jquery)("#" + id).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");

          _events.trigger("stage:interactionStop");
        });
      }
    }
    /**
     * @returns {WysiwygSetup}
     */


    var _proto = Wysiwyg.prototype;

    _proto.getAdapter = function getAdapter() {
      return this.wysiwygAdapter;
    };
    /**
     * @param {Function} callback
     */


    _proto.onEdited = function onEdited(callback) {
      this.wysiwygAdapter.eventBus.attachEventHandler("tinymceChange", callback);
    };
    /**
     * @param {Function} callback
     */


    _proto.onFocused = function onFocused(callback) {
      this.wysiwygAdapter.eventBus.attachEventHandler("tinymceFocus", callback);
    };
    /**
     * @param {Function} callback
     */


    _proto.onBlurred = function onBlurred(callback) {
      this.wysiwygAdapter.eventBus.attachEventHandler("tinymceBlur", callback);
    };

    return Wysiwyg;
  }();

  return Wysiwyg;
});
//# sourceMappingURL=wysiwyg.js.map
