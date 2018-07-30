/*eslint-disable */
define(["Magento_PageBuilder/js/content-type-menu/option"], function (_option) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var HideShow =
  /*#__PURE__*/
  function (_Option) {
    _inheritsLoose(HideShow, _Option);

    /**
     * @param parent
     * @param code
     * @param icon
     * @param title
     * @param action
     * @param classes
     * @param sort
     * @param optionTemplate
     */
    function HideShow(parent, code, icon, title, action, classes, sort, optionTemplate) {
      var _this;

      _this = _Option.call(this, parent, code, icon, title, action, classes, sort, optionTemplate) || this;
      _this.dynamicIcon = void 0;
      return _this;
    }

    return HideShow;
  }(_option);

  return HideShow;
});
//# sourceMappingURL=hide-show.js.map
