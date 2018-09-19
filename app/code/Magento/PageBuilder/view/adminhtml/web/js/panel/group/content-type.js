/*eslint-disable */
define(["knockout", "Magento_PageBuilder/js/drag-drop/matrix"], function (_knockout, _matrix) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ContentType =
  /*#__PURE__*/
  function () {
    /**
     * @param {string} identifier
     * @param {ContentTypeConfigInterface} config
     */
    function ContentType(identifier, config) {
      Object.defineProperty(this, "droppable", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: true
      });
      Object.defineProperty(this, "config", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "icon", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable("")
      });
      Object.defineProperty(this, "identifier", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable("")
      });
      Object.defineProperty(this, "label", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable("")
      });
      this.config = config;
      this.identifier(identifier);
      this.label(config.label);
      this.icon(config.icon);
    }
    /**
     * Retrieve the config object
     *
     * @returns {ContentTypeConfigInterface}
     */


    var _proto = ContentType.prototype;

    _proto.getConfig = function getConfig() {
      return this.config;
    };
    /**
     * Only connect to container sortable instances that the current content type is accepted into
     *
     * @returns {string}
     */


    _proto.getDraggableOptions = function getDraggableOptions() {
      return {
        connectToSortable: (0, _matrix.getAllowedContainersClasses)(this.config.name)
      };
    };

    return ContentType;
  }();

  return {
    ContentType: ContentType
  };
});
//# sourceMappingURL=content-type.js.map
