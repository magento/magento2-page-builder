/*eslint-disable */
define(["mage/adminhtml/wysiwyg/tiny_mce/setup"], function (_setup) {
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
      this.wysiwygAdapter = new _setup(id + "-editor", config);

      if (mode) {
        this.wysiwygAdapter.setup(mode);
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
