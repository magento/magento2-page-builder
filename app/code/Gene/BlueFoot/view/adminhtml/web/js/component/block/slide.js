define(["./block", "underscore"], function (_block, _underscore) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Slide =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Slide, _Block);

    function Slide() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Slide.prototype;

    /**
     * Get the styles with parents text alignment
     *
     * @returns {boolean}
     */
    _proto.getStylesWithoutTextAlign = function getStylesWithoutTextAlign() {
      var oldStyle = this.getStyle();

      var style = _underscore.clone(oldStyle);

      style.textAlign = "";
      return style;
    };

    return Slide;
  }(_block);

  return Slide;
});
//# sourceMappingURL=slide.js.map
