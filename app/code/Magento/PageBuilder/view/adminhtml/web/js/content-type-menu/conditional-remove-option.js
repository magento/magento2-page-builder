/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["Magento_PageBuilder/js/content-type-menu/option"], function (_option) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ConditionalRemoveOption =
  /*#__PURE__*/
  function (_Option) {
    _inheritsLoose(ConditionalRemoveOption, _Option);

    /**
     * @param {OptionConfigInterface} config
     */
    function ConditionalRemoveOption(config) {
      var _this;

      _this = _Option.call(this, config) || this;
      var parentContentType = _this.preview.parent.parent;

      if (parentContentType.children().length < 2) {
        _this.isDisabled(true);
      }

      parentContentType.children.subscribe(function (children) {
        _this.isDisabled(children.length < 2);
      });
      return _this;
    }

    return ConditionalRemoveOption;
  }(_option);

  return _extends(ConditionalRemoveOption, {
    __esModule: true
  });
});
//# sourceMappingURL=conditional-remove-option.js.map
