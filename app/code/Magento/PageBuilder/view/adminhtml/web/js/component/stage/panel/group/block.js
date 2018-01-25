/*eslint-disable */
define(["knockout", "../../../event-emitter"], function (_knockout, _eventEmitter) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Block =
  /*#__PURE__*/
  function (_EventEmitter) {
    _inheritsLoose(Block, _EventEmitter);

    /**
     * Block Constructor
     *
     * @param {string} identifier
     * @param {ConfigContentBlock} config
     */
    function Block(identifier, config) {
      var _this;

      _this = _EventEmitter.call(this) || this;
      _this.droppable = true;
      _this.config = void 0;
      _this.icon = _knockout.observable("");
      _this.identifier = _knockout.observable("");
      _this.label = _knockout.observable("");
      _this.config = config;

      _this.identifier(identifier);

      _this.label(config.label);

      _this.icon(config.icon);

      return _this;
    }
    /**
     * Retrieve the config object
     *
     * @returns {ConfigContentBlock}
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


    _proto.getDraggableConfig = function getDraggableConfig() {
      return this.config.allowed_parents.map(function (value, index) {
        return "." + value + "-container";
      }).join(", ");
    };

    return Block;
  }(_eventEmitter);

  return {
    Block: Block
  };
});
//# sourceMappingURL=block.js.map
