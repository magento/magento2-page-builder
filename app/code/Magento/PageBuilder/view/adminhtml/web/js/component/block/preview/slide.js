/*eslint-disable */
define(["knockout", "./block"], function (_knockout, _block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Slide =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Slide, _PreviewBlock);

    /**
     * @param {Block} parent
     * @param {object} config
     */
    function Slide(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.backgroundImageStyle = void 0;
      _this.backgroundImageStyle = _knockout.computed(function () {
        if (_this.data.background_image && _typeof(_this.data.background_image()[0]) === "object") {
          return {
            backgroundImage: "url(" + _this.data.background_image()[0].url + ")"
          };
        }

        return {};
      });
      return _this;
    }

    return Slide;
  }(_block);

  return Slide;
});
//# sourceMappingURL=slide.js.map
