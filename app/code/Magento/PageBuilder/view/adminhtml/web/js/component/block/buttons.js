/*eslint-disable */
define(["Magento_PageBuilder/js/component/block/factory", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/block/block"], function (_factory, _config, _eventBus, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Buttons =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Buttons, _Block);

    function Buttons() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Buttons.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _Block.prototype.bindEvents.call(this);

      _eventBus.on("buttons:block:ready", function (event, params) {
        if (params.id === _this.id && _this.children().length === 0) {
          _this.addButton();
        }
      });
    };
    /**
     * Add button-item to buttons children array
     */


    _proto.addButton = function addButton() {
      var _this2 = this;

      var createBlockPromise = (0, _factory)(_config.getInitConfig("content_types")["button-item"], this.parent, this.stage, {});
      createBlockPromise.then(function (button) {
        _this2.addChild(button);

        return button;
      }).catch(function (error) {
        console.error(error);
      });
    };

    return Buttons;
  }(_block);

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
