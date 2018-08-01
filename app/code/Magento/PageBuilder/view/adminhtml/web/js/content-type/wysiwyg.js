/*eslint-disable */
define(["jquery", "Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/content-type/wysiwyg-factory"], function (_jquery, _events, _underscore, _wysiwygFactory) {
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
     * @param {String} contentTypeId
     * @param {String} elementId
     * @param {AdditionalDataConfigInterface} config
     * @param {DataStore} dataStore
     */
    function Wysiwyg(contentTypeId, elementId, config, dataStore) {
      this.contentTypeId = void 0;
      this.wysiwygAdapter = void 0;
      this.dataStore = void 0;
      this.fieldName = void 0;
      this.contentTypeId = contentTypeId; // todo refactor here

      this.fieldName = config.additional.fieldName;
      this.dataStore = dataStore;
      config = this.encapsulateConfigBasedOnContentType(config);
      this.wysiwygAdapter = (0, _wysiwygFactory)(elementId, config);
      var $element = (0, _jquery)("#" + elementId);
      var minToolbarWidth = config.additional.minToolbarWidth; // prevent interactability with options when in editing mode

      this.onFocus(function () {
        window.getSelection().empty();
        (0, _jquery)("#" + elementId).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active"); // If there isn't enough room for a left-aligned toolbar, right align it

        if ((0, _jquery)(window).width() < $element.offset().left + parseInt(minToolbarWidth)) {
          $element.addClass("_right-aligned-toolbar");
        } else {
          $element.removeClass("_right-aligned-toolbar");
        }

        _events.trigger("stage:interactionStart"); // Wait for everything else to finish


        _underscore.defer(function () {
          (0, _jquery)(config.adapter.settings.fixed_toolbar_container + " .mce-tinymce-inline").css("min-width", minToolbarWidth + "px");
        });
      }); // resume normal interactability with opens when leaving editing mode

      this.onBlur(function () {
        window.getSelection().empty();
        (0, _jquery)("#" + elementId).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");

        _events.trigger("stage:interactionStop");
      }); // Update content in our data store after our stage preview wysiwyg gets updated

      this.onEdit(this.saveContentFromWysiwygToDataStore.bind(this)); // Update content in our stage preview wysiwyg after its slideout counterpart gets updated

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


    _proto.onEdit = function onEdit(callback) {
      this.wysiwygAdapter.eventBus.attachEventHandler(this.wysiwygAdapter.EVENT.AFTER_CONTENT_CHANGE, _underscore.debounce(callback, 100));
    };
    /**
     * @param {Function} callback
     */


    _proto.onFocus = function onFocus(callback) {
      this.wysiwygAdapter.eventBus.attachEventHandler(this.wysiwygAdapter.EVENT.AFTER_FOCUS, callback);
    };
    /**
     * @param {Function} callback
     */


    _proto.onBlur = function onBlur(callback) {
      this.wysiwygAdapter.eventBus.attachEventHandler(this.wysiwygAdapter.EVENT.AFTER_BLUR, callback);
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
    /**
     * Prepend specific config with id to encapsulate its targeting by the vendor wysiwyg editor
     *
     * @param {AdditionalDataConfigInterface} config
     * @returns {AdditionalDataConfigInterface} - interpolated configuration
     */


    _proto.encapsulateConfigBasedOnContentType = function encapsulateConfigBasedOnContentType(config) {
      var _this = this;

      var clonedConfig = _jquery.extend(true, {}, config);

      if (!clonedConfig.additional.encapsulateSelectorConfigKeys) {
        return clonedConfig;
      }

      _underscore.each(clonedConfig.additional.encapsulateSelectorConfigKeys, function (isEnabled, configKey) {
        var configValue = clonedConfig.adapter.settings[configKey];

        if (!isEnabled) {
          return;
        }

        clonedConfig.adapter.settings[configKey] = "#" + _this.contentTypeId + (configValue ? " " + configValue : "");
      });

      return clonedConfig;
    };

    return Wysiwyg;
  }();

  return Wysiwyg;
});
//# sourceMappingURL=wysiwyg.js.map
