/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/preview-collection", "Magento_PageBuilder/js/component/stage/structural/options/option"], function (_translate, _previewCollection, _option) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var TabItem =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(TabItem, _PreviewCollection);

    function TabItem() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewCollection.call.apply(_PreviewCollection, [this].concat(args)) || this, _this.fieldsToIgnoreOnRemove = ["tab_name"], _temp) || _this;
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
    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      var options = _PreviewCollection.prototype.retrieveOptions.call(this);

      var newOptions = options.filter(function (option) {
        return option.code !== "remove";
      });
      var removeClasses = ["remove-structural"];
      var removeFn = this.onOptionRemove;

      if (this.parent.children().length <= 1) {
        //        if (this.parent.parent.children().length <= 1) {
        removeFn = function removeFn() {
          return;
        };

        removeClasses.push("disabled");
      }

      newOptions.push(new _option.Option(this, "remove", "<i class='icon-admin-pagebuilder-remove'></i>", (0, _translate)("Remove"), removeFn, removeClasses, 100));
      return newOptions;
    };

    return TabItem;
  }(_previewCollection);

  return TabItem;
});
//# sourceMappingURL=tab-item.js.map
