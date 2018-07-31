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
     * Element id
     */

    /**
     * Element
     */

    /**
     * String
     */

    /**
     *
     * @param {String} contentTypeId
     * @param {String} elementId
     * @param {Object} config
     * @param {DataStore} dataStore
     * @param {() => void} onFocusCallback
     * @param {() => void} onBlurCallback
     * @param {() => void} onEditCallback
     */
    function Wysiwyg(contentTypeId, elementId, config, dataStore, onFocusCallback, onBlurCallback, onEditCallback) {
      if (onFocusCallback === void 0) {
        onFocusCallback = null;
      }

      if (onBlurCallback === void 0) {
        onBlurCallback = null;
      }

      if (onEditCallback === void 0) {
        onEditCallback = null;
      }

      this.contentTypeId = void 0;
      this.wysiwygAdapter = void 0;
      this.dataStore = void 0;
      this.fieldName = void 0;
      this.elementId = void 0;
      this.element = void 0;
      this.maxToolbarWidth = void 0;
      this.contentTypeId = contentTypeId; // todo refactor here

      this.fieldName = config.additional.fieldName;
      this.dataStore = dataStore;
      config = this.encapsulateConfigBasedOnContentType(config);
      this.wysiwygAdapter = (0, _wysiwygFactory)(elementId, config);
      this.element = (0, _jquery)("#" + elementId);
      this.elementId = elementId;
      this.maxToolbarWidth = 360; // prevent interactability with options when in editing mode

      this.wysiwygAdapter.eventBus.attachEventHandler("tinymceFocus", onFocusCallback ? onFocusCallback : this.onFocus.bind(this)); // resume normal interactability with opens when leaving editing mode

      this.wysiwygAdapter.eventBus.attachEventHandler("tinymceBlur", onBlurCallback ? onBlurCallback : this.onBlur.bind(this)); // Update content in our data store after our stage preview wysiwyg gets updated

      this.wysiwygAdapter.eventBus.attachEventHandler("tinymceChange", _underscore.debounce(onEditCallback ? onEditCallback : this.saveContentFromWysiwygToDataStore.bind(this), 100)); // Update content in our stage preview wysiwyg after its slideout counterpart gets updated

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


    _proto.onFocus = function onFocus(callback) {
      (0, _jquery)("#" + this.elementId).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active"); // If there isn't enough room for a left-aligned toolbar, right align it

      if ((0, _jquery)(window).width() < this.element.offset().left + this.maxToolbarWidth) {
        this.element.addClass('_right-aligned-toolbar');
      } else {
        this.element.removeClass('_right-aligned-toolbar');
      }

      _events.trigger("stage:interactionStart");
    };
    /**
     * @param {Function} callback
     */


    _proto.onBlur = function onBlur(callback) {
      window.getSelection().empty();
      (0, _jquery)("#" + this.elementId).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStop");
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
     * @param {object} config
     * @returns {object} - interpolated configuration
     * //todo move in the separate function
     */


    _proto.encapsulateConfigBasedOnContentType = function encapsulateConfigBasedOnContentType(config) {
      var _this = this;

      var clonedConfig = Object.assign({}, config);

      if (!clonedConfig["additional"].encapsulateSelectorConfigKeys) {
        return clonedConfig;
      }

      _underscore.each(clonedConfig["additional"].encapsulateSelectorConfigKeys, function (isEnabled, configKey) {
        var configValue = clonedConfig["adapter"].settings[configKey];

        if (!isEnabled) {
          return;
        }

        clonedConfig['adapter'].settings[configKey] = "#" + _this.contentTypeId + (configValue ? " " + configValue : "");
      });

      return clonedConfig;
    };

    return Wysiwyg;
  }();

  return Wysiwyg;
});
//# sourceMappingURL=wysiwyg.js.map
