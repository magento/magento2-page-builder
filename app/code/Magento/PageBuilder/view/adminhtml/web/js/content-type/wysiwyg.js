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
     * @param {Object} config
     * @param {DataStore} dataStore
     */
    function Wysiwyg(contentTypeId, elementId, config, dataStore) {
      this.contentTypeId = void 0;
      this.wysiwygAdapter = void 0;
      this.dataStore = void 0;
      this.fieldName = void 0;
      this.contentTypeId = contentTypeId;
      this.fieldName = config.fieldName;
      this.dataStore = dataStore;
      config = this.encapsulateConfigBasedOnContentType(config);
      var mode = config.mode;
      this.wysiwygAdapter = new _setup(elementId, config.wysiwygConfigData);

      if (mode) {
        this.wysiwygAdapter.setup(mode);
      }

      var $element = (0, _jquery)("#" + elementId);
      var maxToolbarWidth = 360; // prevent interactability with options when in editing mode

      this.onFocus(function () {
        (0, _jquery)("#" + elementId).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active"); // If there isn't enough room for a left-aligned toolbar, right align it

        if ((0, _jquery)(window).width() < $element.offset().left + maxToolbarWidth) {
          $element.addClass('_right-aligned-toolbar');
        } else {
          $element.removeClass('_right-aligned-toolbar');
        }

        _events.trigger("stage:interactionStart");
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
      this.wysiwygAdapter.eventBus.attachEventHandler("tinymceChange", _underscore.debounce(callback, 100));
    };
    /**
     * @param {Function} callback
     */


    _proto.onFocus = function onFocus(callback) {
      this.wysiwygAdapter.eventBus.attachEventHandler("tinymceFocus", callback);
    };
    /**
     * @param {Function} callback
     */


    _proto.onBlur = function onBlur(callback) {
      this.wysiwygAdapter.eventBus.attachEventHandler("tinymceBlur", callback);
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
     */


    _proto.encapsulateConfigBasedOnContentType = function encapsulateConfigBasedOnContentType(config) {
      var _this = this;

      var clonedConfig = _jquery.extend(true, {}, config);

      if (!clonedConfig.encapsulateSelectorConfigKeys) {
        return clonedConfig;
      }

      _underscore.each(clonedConfig.encapsulateSelectorConfigKeys, function (isEnabled, configKey) {
        var configValue = clonedConfig.wysiwygConfigData.settings[configKey];

        if (!isEnabled) {
          return;
        }

        clonedConfig.wysiwygConfigData.settings[configKey] = "#" + _this.contentTypeId + (configValue ? " " + configValue : "");
      });

      return clonedConfig;
    };

    return Wysiwyg;
  }();

  return Wysiwyg;
});
//# sourceMappingURL=wysiwyg.js.map
