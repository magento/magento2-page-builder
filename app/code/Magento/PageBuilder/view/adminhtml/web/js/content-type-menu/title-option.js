/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

  return _extends(TitleOption, {
    __esModule: true
  });
});
//# sourceMappingURL=title-option.js.map
