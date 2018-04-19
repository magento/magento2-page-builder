/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/component/block/factory", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/block/block"], function (_uiEvents, _factory, _config, _block) {
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

      _uiEvents.on("buttons:block:ready", function (event, args) {
        if (args.id === _this.id && _this.children().length === 0) {
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

        _this2.preview.isLiveEditing(_this2.children().indexOf(button));

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
