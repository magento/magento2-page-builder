/*eslint-disable */
define(["Magento_PageBuilder/js/component/block/block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var TabItem =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(TabItem, _Block);

    function TabItem() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = TabItem.prototype;

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

    return TabItem;
  }(_block);

  return TabItem;
});
//# sourceMappingURL=tab-item.js.map
