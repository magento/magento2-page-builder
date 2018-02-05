/*eslint-disable */
define(["./block"], function (_block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Column =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Column, _PreviewBlock);

    function Column() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Column.prototype;

    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */
    _proto.afterStyleMapped = function afterStyleMapped(styles) {
      // Extract data values our of observable functions
      // The style attribute mapper converts images to directives, override it to include the correct URL
      if (this.data.background_image && _typeof(this.data.background_image()[0]) === "object") {
        styles.backgroundImage = "url(" + this.data.background_image()[0].url + ")";
      }

      return styles;
    };

    return Column;
  }(_block);

  return Column;
});
//# sourceMappingURL=column.js.map
