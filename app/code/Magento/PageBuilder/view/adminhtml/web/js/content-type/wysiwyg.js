/*eslint-disable */
define(["Magento_PageBuilder/js/events", "mage/adminhtml/wysiwyg/tiny_mce/setup"], function (_events, _setup) {
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
          _events.trigger("stage:interactionStart");
        }); // resume normal interactability with opens when leaving inline editing mode

        this.onBlurred(function () {
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
