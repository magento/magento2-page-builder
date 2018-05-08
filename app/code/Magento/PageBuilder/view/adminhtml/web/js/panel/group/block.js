/*eslint-disable */
define(["knockout"], function (_knockout) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Block =
  /*#__PURE__*/
  function () {
    /**
     * @param {string} identifier
     * @param {ContentTypeConfigInterface} config
     */
    function Block(identifier, config) {
      this.droppable = true;
      this.config = void 0;
      this.icon = _knockout.observable("");
      this.identifier = _knockout.observable("");
      this.label = _knockout.observable("");
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


    var _proto = Block.prototype;

    _proto.getConfig = function getConfig() {
      return this.config;
    };
    /**
     * Return the draggable config to the element
     *
     * @returns {string}
     */


    _proto.getDraggableOptions = function getDraggableOptions() {
      return {
        connectToSortable: this.config.allowed_parents.map(function (value, index) {
          return "." + value + "-container";
        }).join(", ")
      };
    };

    return Block;
  }();

  return {
    Block: Block
  };
});
//# sourceMappingURL=block.js.map
