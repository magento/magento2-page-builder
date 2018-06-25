/*eslint-disable */
define(["uiEvents", "uiLayout", "uiRegistry"], function (_uiEvents, _uiLayout, _uiRegistry) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Uploader =
  /*#__PURE__*/
  function () {
    /**
     * Id of uploader instance
     */

    /**
     * Name of uploader instance
     */

    /**
     * Config data of uploader instance
     */

    /**
     * @param {String} id
     * @param {String} name - Name to use for lookup reference in registry
     * @param {Object} config
     */
    function Uploader(id, name, config) {
      this.id = void 0;
      this.name = void 0;
      this.config = void 0;
      config.id = this.id = id;
      config.name = this.name = name;
      this.config = config; // Render uploader

      this.render();
    }
    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Function}
     */


    var _proto = Uploader.prototype;

    _proto.getUiComponent = function getUiComponent() {
      return _uiRegistry.async(this.name);
    };
    /**
     * Register callback when file is uploaded through this instance
     *
     * @param {Function} callback - callback function containing array of file objects as argument
     */


    _proto.onUploaded = function onUploaded(callback) {
      _uiEvents.on("image:uploadAfter:" + this.id, callback);
    };
    /**
     * Instantiate uploader through layout UI component renderer
     */


    _proto.render = function render() {
      (0, _uiLayout)([this.config]);
    };

    return Uploader;
  }();

  return Uploader;
});
//# sourceMappingURL=uploader.js.map
