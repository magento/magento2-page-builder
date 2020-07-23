/*eslint-disable */
/* jscs:disable */
define(["knockout", "Magento_PageBuilder/js/drag-drop/matrix"], function (_knockout, _matrix) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ContentType =
  /*#__PURE__*/
  function () {
    "use strict";

    /**
     * @param {string} identifier
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    function ContentType(identifier, config, stageId) {
      this.droppable = true;
      this.icon = _knockout.observable("");
      this.identifier = _knockout.observable("");
      this.label = _knockout.observable("");
      this.config = config;
      this.identifier(identifier);
      this.label(config.label);
      this.icon(config.icon);
      this.stageId = stageId;
    }
    /**
     * Retrieve the config object
     *
     * @returns {ContentTypeConfigInterface}
     */


    var _proto = ContentType.prototype;

    _proto.getConfig = function getConfig() {
      return this.config;
    }
    /**
     * Only connect to container sortable instances that the current content type is accepted into
     *
     * @returns {string}
     */
    ;

    _proto.getDraggableOptions = function getDraggableOptions() {
      return {
        connectToSortable: (0, _matrix.getAllowedContainersClasses)(this.config.name, this.stageId)
      };
    };

    return ContentType;
  }();

  return {
    ContentType: ContentType
  };
});
//# sourceMappingURL=content-type.js.map