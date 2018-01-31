/*eslint-disable */
define(["knockout", "./block"], function (_knockout, _block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Banner =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Banner, _PreviewBlock);

    function Banner(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.previewStyle = _knockout.computed(function () {
        // Extract data values our of observable functions
        var styles = _PreviewBlock.prototype.previewStyle.call(_this); // The style attribute mapper converts images to directives, override it to include the correct URL


        if (_this.data.background_image && _typeof(_this.data.background_image()[0]) === "object") {
          styles.backgroundImage = "url(" + _this.data.background_image()[0].url + ")";
        }

        if (typeof _this.data.mobile_image === "function" && _this.data.mobile_image() !== "" && _this.data.mobile_image() && _typeof(_this.data.mobile_image()[0]) === "object") {
          styles.mobileImage = "url(" + _this.data.mobile_image()[0].url + ")";
        }

        return styles;
      });
      return _this;
    }

    return Banner;
  }(_block);

  return Banner;
});
//# sourceMappingURL=banner.js.map
