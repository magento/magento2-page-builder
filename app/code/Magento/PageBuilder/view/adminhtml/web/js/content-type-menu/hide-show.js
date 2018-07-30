/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/content-type-menu/option"], function (_translate, _option) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var HideShow =
  /*#__PURE__*/
  function (_Option) {
    _inheritsLoose(HideShow, _Option);

    function HideShow() {
      return _Option.apply(this, arguments) || this;
    }

    var _proto = HideShow.prototype;

    /**
     * Bind events for the icon & title change
     */
    _proto.bindEvents = function bindEvents() {
      // Modify the icon when changes are made to display in the data store
      this.parent.parent.dataStore.subscribe(this.onDisplayChange.bind(this), "display");
    };
    /**
     * On display change update the title and icon
     *
     * @param {DataObject} state
     */


    _proto.onDisplayChange = function onDisplayChange(state) {
      var display = !!state.display;

      if (display) {
        this.icon(HideShow.HIDE_ICON);
        this.title(HideShow.HIDE_TEXT);
      } else {
        this.icon(HideShow.SHOW_ICON);
        this.title(HideShow.SHOW_TEXT);
      }
    };

    return HideShow;
  }(_option);

  HideShow.SHOW_TEXT = (0, _translate)("Show");
  HideShow.SHOW_ICON = "<i class='icon-admin-pagebuilder-systems'></i>";
  HideShow.HIDE_TEXT = (0, _translate)("Hide");
  HideShow.HIDE_ICON = "<i class='icon-pagebuilder-copy'></i>";
  return HideShow;
});
//# sourceMappingURL=hide-show.js.map
