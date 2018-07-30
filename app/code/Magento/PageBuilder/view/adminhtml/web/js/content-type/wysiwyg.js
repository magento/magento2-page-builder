/*eslint-disable */
define(["jquery", "mage/adminhtml/wysiwyg/tiny_mce/setup", "Magento_PageBuilder/js/events", "underscore"], function (_jquery, _setup, _events, _underscore) {
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
     * Content type's data store
     */

    /**
     * Key in data store reflecting value held in wysiwyg
     */

    /**
     * @param {String} contentTypeId
     * @param {String} elementId
     * @param {Object} config
     * @param {String} mode
     * @param {DataStore} dataStore
     * @param {String} dataStoreKey
     */
    function Wysiwyg(contentTypeId, elementId, config, mode, dataStore, dataStoreKey) {
      this.wysiwygAdapter = void 0;
      this.dataStore = void 0;
      this.dataStoreKey = void 0;
      this.wysiwygAdapter = new _setup(elementId, config);
      this.dataStore = dataStore;
      this.dataStoreKey = dataStoreKey;

      if (mode) {
        this.wysiwygAdapter.setup(mode);
      }

      if (mode === "inline") {
        // prevent interactability with options when in inline editing mode
        this.onFocused(function () {
          (0, _jquery)("#" + elementId).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");

          _events.trigger("stage:interactionStart");
        }); // resume normal interactability with opens when leaving inline editing mode

        this.onBlurred(function () {
          window.getSelection().empty();
          (0, _jquery)("#" + elementId).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");

          _events.trigger("stage:interactionStop");
        });
      } // Update content in our data store after our stage preview wysiwyg gets updated


      this.onEdited(this.saveContentFromWysiwygToDataStore.bind(this)); // Update content in our stage preview wysiwyg after its slideout counterpart gets updated

      _events.on("form:" + contentTypeId + ":saveAfter", this.setContentFromDataStoreToWysiwyg.bind(this));
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
      this.wysiwygAdapter.eventBus.attachEventHandler("tinymceChange", _underscore.debounce(callback, 100));
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
    /**
     * Update content in our data store after our stage preview wysiwyg gets updated
     */


    _proto.saveContentFromWysiwygToDataStore = function saveContentFromWysiwygToDataStore() {
      this.dataStore.update(this.getAdapter().getContent(), this.dataStoreKey);
    };
    /**
     * Update content in our stage wysiwyg after our data store gets updated
     */


    _proto.setContentFromDataStoreToWysiwyg = function setContentFromDataStoreToWysiwyg() {
      this.getAdapter().setContent(this.dataStore.get(this.dataStoreKey));
    };

    return Wysiwyg;
  }();

  return Wysiwyg;
});
//# sourceMappingURL=wysiwyg.js.map
