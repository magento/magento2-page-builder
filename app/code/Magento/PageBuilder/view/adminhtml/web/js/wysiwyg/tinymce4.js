/*eslint-disable */
define(["jquery", "mage/adminhtml/wysiwyg/events", "mage/adminhtml/wysiwyg/tiny_mce/setup", "Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/utils/check-stage-full-screen"], function (_jquery, _events, _setup, _events2, _underscore, _checkStageFullScreen) {
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
    "use strict";

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
     * Id of the stage
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
     * Create a debounce to save the content into the data store
     */

    /**
     * @param {String} contentTypeId The ID in the registry of the content type.
     * @param {String} elementId The ID of the editor element in the DOM.
     * @param {AdditionalDataConfigInterface} config The configuration for the wysiwyg.
     * @param {DataStore} dataStore The datastore to store the content in.
     * @param {String} fieldName The key in the provided datastore to set the data.
     * @param {String} stageId The ID in the registry of the stage containing the content type.
     */
    function Wysiwyg(contentTypeId, elementId, config, dataStore, fieldName, stageId) {
      this.saveContentDebounce = _underscore.debounce(this.saveContentFromWysiwygToDataStore.bind(this), 500);
      this.contentTypeId = contentTypeId;
      this.elementId = elementId;
      this.fieldName = fieldName;
      this.config = config;
      this.dataStore = dataStore;
      this.stageId = stageId;

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


      this.wysiwygAdapter.eventBus.attachEventHandler(_events.afterChangeContent, this.onChangeContent.bind(this)); // Update content in our stage preview wysiwyg after its slideout counterpart gets updated

      _events2.on("form:" + this.contentTypeId + ":saveAfter", this.setContentFromDataStoreToWysiwyg.bind(this));
    }
    /**
     * @returns {WysiwygInstanceInterface}
     */


    var _proto = Wysiwyg.prototype;

    _proto.getAdapter = function getAdapter() {
      return this.wysiwygAdapter;
    }
    /**
     * Called for the onFocus event
     */
    ;

    _proto.onFocus = function onFocus() {
      var _this = this;

      this.getFixedToolbarContainer().addClass("pagebuilder-toolbar-active");

      _events2.trigger("stage:interactionStart"); // Wait for everything else to finish


      _underscore.defer(function () {
        _this.getFixedToolbarContainer().find(".mce-tinymce-inline").css("min-width", _this.config.adapter_config.minToolbarWidth + "px");

        _this.invertInlineEditorToAccommodateOffscreenToolbar();
      });
    }
    /**
     * Called for the onChangeContent event
     */
    ;

    _proto.onChangeContent = function onChangeContent() {
      this.saveContentDebounce();
      this.invertInlineEditorToAccommodateOffscreenToolbar();
    }
    /**
     * Called for the onBlur events
     */
    ;

    _proto.onBlur = function onBlur() {
      this.getFixedToolbarContainer().removeClass("pagebuilder-toolbar-active").find(".mce-tinymce-inline").css("transform", "");

      _events2.trigger("stage:interactionStop");
    }
    /**
     * Update content in our data store after our stage preview wysiwyg gets updated
     */
    ;

    _proto.saveContentFromWysiwygToDataStore = function saveContentFromWysiwygToDataStore() {
      this.dataStore.set(this.fieldName, this.getAdapter().getContent());
    }
    /**
     * Update content in our stage wysiwyg after our data store gets updated
     */
    ;

    _proto.setContentFromDataStoreToWysiwyg = function setContentFromDataStoreToWysiwyg() {
      this.getAdapter().setContent(this.dataStore.get(this.fieldName));
    }
    /**
     * Adjust padding on stage if in fullscreen mode to accommodate inline wysiwyg toolbar overflowing fixed viewport
     */
    ;

    _proto.invertInlineEditorToAccommodateOffscreenToolbar = function invertInlineEditorToAccommodateOffscreenToolbar() {
      if (this.config.adapter_config.mode !== "inline") {
        return;
      }

      var $inlineToolbar = this.getFixedToolbarContainer().find(".mce-tinymce-inline");

      if (!$inlineToolbar.length) {
        return;
      }

      var inlineWysiwygClientRectTop = this.getFixedToolbarContainer().get(0).getBoundingClientRect().top;

      if (!(0, _checkStageFullScreen)(this.stageId) || $inlineToolbar.height() < inlineWysiwygClientRectTop) {
        $inlineToolbar.css("transform", "translateY(-100%)");
        return;
      }

      $inlineToolbar.css("transform", "translateY(" + this.getFixedToolbarContainer().height() + "px)");
    }
    /**
     * Get fixed toolbar container element referenced as selector in wysiwyg adapter settings
     *
     * @returns {jQuery}
     */
    ;

    _proto.getFixedToolbarContainer = function getFixedToolbarContainer() {
      return (0, _jquery)("#" + this.elementId).closest("" + this.config.adapter.settings.fixed_toolbar_container);
    };

    return Wysiwyg;
  }();

  return Wysiwyg;
});
//# sourceMappingURL=tinymce4.js.map