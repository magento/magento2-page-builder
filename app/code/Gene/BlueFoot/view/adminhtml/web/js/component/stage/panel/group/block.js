define(["../../../event-emitter", "knockout"], function (_eventEmitter, _knockout) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * Block Class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var Block =
  /*#__PURE__*/
  function (_EventEmitter) {
    _inheritsLoose(Block, _EventEmitter);

    /**
     * Block Constructor
     *
     * @param {string} identifier
     * @param {ContentBlockConfig} config
     */
    function Block(identifier, config) {
      var _this;

      _this = _EventEmitter.call(this) || this;
      _this.config = void 0;
      _this.identifier = _knockout.observable('');
      _this.label = _knockout.observable('');
      _this.icon = _knockout.observable('');
      _this.droppable = true;
      _this.config = config;

      _this.identifier(identifier);

      _this.label(config.label);

      _this.icon(config.icon);

      return _this;
    }

    var _proto = Block.prototype;

    _proto.getDraggableConfig = function getDraggableConfig() {
      return this.config.allowed_children.map(function (value, index) {
        return '.' + value + '-container';
      }).join(', ');
    };

    return Block;
  }(_eventEmitter);

  return {
    Block: Block
  };
});
//# sourceMappingURL=block.js.map
