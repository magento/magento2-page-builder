/*eslint-disable */
define(["jquery", "mage/adminhtml/wysiwyg/events", "mage/adminhtml/wysiwyg/tiny_mce/setup", "Magento_PageBuilder/js/events", "underscore"], function (_jquery, _events, _setup, _events2, _underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Inline editing wysiwyg component
   *
   * @api
   */
  var Wysiwyg =
  /*#__PURE__*/
  function () {
    /**
     * The id of the editor element
     */

    /**
     * The supplied wysiwyg configuration
     */

    /**
     * Id of content type
     */

    /**
     * Wysiwyg adapter instance
     */

    /**
     * Content type's data store
     */

    /**
     * Field name in data store reflecting value held in wysiwyg
     */

    /**
     * @param {String} contentTypeId The ID in the registry of the content type.
     * @param {String} elementId The ID of the editor element in the DOM.
     * @param {AdditionalDataConfigInterface} config The configuration for the wysiwyg.
     * @param {DataStore} dataStore The datastore to store the content in.
     * @param {String} fieldName The key in the provided datastore to set the data.
     */
    function Wysiwyg(contentTypeId, elementId, config, dataStore, fieldName) {
      this.elementId = void 0;
      this.config = void 0;
      this.contentTypeId = void 0;
      this.wysiwygAdapter = void 0;
      this.dataStore = void 0;
      this.fieldName = void 0;
      this.contentTypeId = contentTypeId;
      this.elementId = elementId;
      this.fieldName = fieldName;
      this.config = config;
      this.dataStore = dataStore;

      if (this.config.adapter_config.mode === "inline") {
        /**
         * Don't include content_css within the inline mode of TinyMCE, if any stylesheets are included here they're
         * appended to the head of the main page, and thus cause other styles to be modified.
         *
         * The styles for typography in the inline editor are scoped within _typography.less
         */
        this.config.adapter.tinymce4.content_css = [];
      }

      var wysiwygSetup = new _setup(this.elementId, this.config.adapter);
      wysiwygSetup.setup(this.config.adapter_config.mode);
      this.wysiwygAdapter = wysiwygSetup.wysiwygInstance;

      if (this.config.adapter_config.mode === "inline") {
        this.wysiwygAdapter.eventBus.attachEventHandler(_events.afterFocus, this.onFocus.bind(this));
        this.wysiwygAdapter.eventBus.attachEventHandler(_events.afterBlur, this.onBlur.bind(this));
      } // Update content in our data store after our stage preview wysiwyg gets updated


      this.wysiwygAdapter.eventBus.attachEventHandler(_events.afterChangeContent, _underscore.debounce(this.saveContentFromWysiwygToDataStore.bind(this), 100)); // Update content in our stage preview wysiwyg after its slideout counterpart gets updated

      _events2.on("form:" + this.contentTypeId + ":saveAfter", this.setContentFromDataStoreToWysiwyg.bind(this));
    }
    /**
     * @returns {WysiwygInstanceInterface}
     */


    var _proto = Wysiwyg.prototype;

    _proto.getAdapter = function getAdapter() {
      return this.wysiwygAdapter;
    };
    /**
     * Called for the onFocus event
     */


    _proto.onFocus = function onFocus() {
      var _this = this;

      // Clear any existing document selections
      window.getSelection().empty();
      (0, _jquery)("#" + this.elementId).closest("" + this.config.adapter.settings.fixed_toolbar_container).addClass("pagebuilder-toolbar-active");

      _events2.trigger("stage:interactionStart"); // Wait for everything else to finish


      _underscore.defer(function () {
        (0, _jquery)(_this.config.adapter.settings.fixed_toolbar_container + " .mce-tinymce-inline").css("min-width", _this.config.adapter_config.minToolbarWidth + "px");
      });
    };
    /**
     * Called for the onBlur events
     */


    _proto.onBlur = function onBlur() {
      // Clear any selections in the editable area
      window.getSelection().empty();
      (0, _jquery)("#" + this.elementId).closest("" + this.config.adapter.settings.fixed_toolbar_container).removeClass("pagebuilder-toolbar-active");

      _events2.trigger("stage:interactionStop");
    };
    /**
     * Update content in our data store after our stage preview wysiwyg gets updated
     */


    _proto.saveContentFromWysiwygToDataStore = function saveContentFromWysiwygToDataStore() {
      this.dataStore.update(this.getAdapter().getContent(), this.fieldName);
    };
    /**
     * Update content in our stage wysiwyg after our data store gets updated
     */


    _proto.setContentFromDataStoreToWysiwyg = function setContentFromDataStoreToWysiwyg() {
      this.getAdapter().setContent(this.dataStore.get(this.fieldName));
    };

    return Wysiwyg;
  }();

  return Wysiwyg;
});
//# sourceMappingURL=tinymce4.js.map
