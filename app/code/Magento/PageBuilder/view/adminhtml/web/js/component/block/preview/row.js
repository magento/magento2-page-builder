/*eslint-disable */
define(["knockout", "./block"], function (_knockout, _block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Row, _PreviewBlock);

    function Row() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewBlock.call.apply(_PreviewBlock, [this].concat(args)) || this, _this.getChildren = void 0, _this.wrapClass = _knockout.observable(false), _temp) || _this;
    }

    var _proto = Row.prototype;

    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */
    _proto.afterStyleMapped = function afterStyleMapped(styles) {
      // The style attribute mapper converts images to directives, override it to include the correct URL
      if (this.data.background_image && _typeof(this.data.background_image()[0]) === "object") {
        styles.backgroundImage = "url(" + this.data.background_image()[0].url + ")";
      } // If the bottom margin is 0, we set it to 1px to overlap the rows to create a single border


      if (styles.marginBottom === "0px") {
        styles.marginBottom = "1px";
      } // If the border is set to default we show no border in the admin preview, as we're unaware of the themes styles


      if (this.data.border && this.data.border() === "_default") {
        styles.border = "none";
      }

      return styles;
    };

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
