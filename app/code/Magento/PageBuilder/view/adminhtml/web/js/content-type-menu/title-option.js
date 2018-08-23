/*eslint-disable */
define(["Magento_PageBuilder/js/content-type-menu/option"], function (_option) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var TitleOption =
  /*#__PURE__*/
  function (_Option) {
    _inheritsLoose(TitleOption, _Option);

    /**
     * @param {OptionConfigInterface} options
     */
    function TitleOption(options) {
      var _this;

      _this = _Option.call(this, options) || this; // Modify the icon when changes are made to display in the data store

      _this.preview.displayLabel.subscribe(function (label) {
        _this.title(label);
      });

      return _this;
    }

    return TitleOption;
  }(_option);

  return TitleOption;
});
//# sourceMappingURL=title-option.js.map
