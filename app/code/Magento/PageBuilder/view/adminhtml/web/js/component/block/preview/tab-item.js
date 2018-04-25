/*eslint-disable */
define(["Magento_PageBuilder/js/preview-collection"], function (_previewCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var TabItem =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(TabItem, _PreviewCollection);

    function TabItem() {
      return _PreviewCollection.apply(this, arguments) || this;
    }

    var _proto = TabItem.prototype;

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    _proto.getOptions = function getOptions() {
      var options = _PreviewCollection.prototype.getOptions.call(this);

      options.removeOption("move");
      options.removeOption("title");
      return options;
    };

    return TabItem;
  }(_previewCollection);

  return TabItem;
});
//# sourceMappingURL=tab-item.js.map
