/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/block/block"], function (_translate, _eventBus, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Tab =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Tab, _Block);

    function Tab() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Tab.prototype;

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    _proto.getOptions = function getOptions() {
      var options = _Block.prototype.getOptions.call(this);

      options.removeOption("move");
      options.removeOption("title");
      return options;
    };
    /**
     * Bind events for the current instance
     */


    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _Block.prototype.bindEvents.call(this); // Block being mounted onto container


      _eventBus.on("tab:block:mount", function (event, params) {
        if (params.id === _this.id) {
          _this.updateDefaultTitle();
        }
      });
    };
    /**
     * Update the title of the tab to Tab N if it has no title
     */


    _proto.updateDefaultTitle = function updateDefaultTitle() {
      var data = this.parent.stage.store.get(this.id);

      if (!data.title) {
        this.parent.stage.store.updateKey(this.id, (0, _translate)("Tab") + " " + (this.parent.children.indexOf(this) + 1), "name");
      }
    };

    return Tab;
  }(_block);

  return Tab;
});
//# sourceMappingURL=tab.js.map
