/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/events", "uiLayout", "uiRegistry"], function (_events, _uiLayout, _uiRegistry) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Uploader = /*#__PURE__*/function () {
    "use strict";

    /**
     * Config data of uploader instance
     */

    /**
     * The supplied data store
     */

    /**
     * @param {String} name Name to use for lookup reference in registry
     * @param {Object} uploaderConfig The config used when initializing the Uploader UI component
     * @param {String} contentTypeId The id of the content type this will be used in
     * @param {DataStore} dataStore The datastore that the selected image should be stored in.
     * @param {Object[]} initialValue The value that should be used for the initial state of the component.
     * @param {Function} onChangeCallback Called when image is added or updated
     * @param {Function} onDeleteCallback Called when currently set image is deleted from storage
     */
    function Uploader(name, uploaderConfig, contentTypeId, dataStore, initialValue, onChangeCallback, onDeleteCallback) {
      if (onChangeCallback === void 0) {
        onChangeCallback = null;
      }

      if (onDeleteCallback === void 0) {
        onDeleteCallback = null;
      }

      var config = Object.assign({}, uploaderConfig, {
        value: initialValue
      });
      config.id = contentTypeId;
      config.name = name;
      this.dataStore = dataStore;

      _events.on("image:" + contentTypeId + ":uploadAfter", onChangeCallback ? onChangeCallback : this.onImageChanged.bind(this));

      _events.on("image:" + contentTypeId + ":deleteFileAfter", onDeleteCallback ? onDeleteCallback : this.onImageDeleted.bind(this));

      this.config = config; // Render uploader

      this.render();
    }
    /**
     * Default callback for upload event
     * @param {object[]} data
     */


    var _proto = Uploader.prototype;

    _proto.onImageChanged = function onImageChanged(data) {
      this.dataStore.set(this.config.dataScope.toString(), data);
    }
    /**
     * Default callback for image deleted event
     */
    ;

    _proto.onImageDeleted = function onImageDeleted() {
      this.dataStore.set(this.config.dataScope.toString(), "");
    }
    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Function}
     */
    ;

    _proto.getUiComponent = function getUiComponent() {
      return _uiRegistry.async(this.config.name);
    }
    /**
     * Instantiate uploader through layout UI component renderer
     */
    ;

    _proto.render = function render() {
      (0, _uiLayout)([this.config]);
    };

    return Uploader;
  }();

  return Uploader;
});
//# sourceMappingURL=uploader.js.map