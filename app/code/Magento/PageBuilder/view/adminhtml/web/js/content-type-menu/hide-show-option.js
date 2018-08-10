/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/content-type-menu/option"], function (_translate, _option) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var HideShowOption =
  /*#__PURE__*/
  function (_Option) {
    _inheritsLoose(HideShowOption, _Option);

    /**
     * @param {OptionConfigInterface} options
     */
    function HideShowOption(options) {
      var _this;

      _this = _Option.call(this, options) || this; // Modify the icon when changes are made to display in the data store

      _this.preview.parent.dataStore.subscribe(_this.onDisplayChange.bind(_this), "display");

      return _this;
    }
    /**
     * On display change update the title and icon
     *
     * @param {DataObject} state
     */


    var _proto = HideShowOption.prototype;

    _proto.onDisplayChange = function onDisplayChange(state) {
      var display = !!state.display;

      if (display) {
        this.icon(HideShowOption.HIDE_ICON);
        this.title(HideShowOption.HIDE_TEXT);
      } else {
        this.icon(HideShowOption.SHOW_ICON);
        this.title(HideShowOption.SHOW_TEXT);
      }
    };

    return HideShowOption;
  }(_option);

  HideShowOption.SHOW_TEXT = (0, _translate)("Show");
  HideShowOption.SHOW_ICON = "<i class='icon-pagebuilder-show'></i>";
  HideShowOption.HIDE_TEXT = (0, _translate)("Hide");
  HideShowOption.HIDE_ICON = "<i class='icon-pagebuilder-hide'></i>";
  return HideShowOption;
});
//# sourceMappingURL=hide-show-option.js.map
