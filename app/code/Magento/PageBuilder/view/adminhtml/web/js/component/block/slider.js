/*eslint-disable */
define(["../block/factory", "../config", "./block"], function (_factory, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Slider =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Slider, _Block);

    function Slider() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Slider.prototype;

    /**
     * Add a slide into the slider
     */
    _proto.addSlide = function addSlide() {
      var _this = this;

      (0, _factory)(_config.getInitConfig("content_types").slide, this.parent, this.stage, {}).then(function (slide) {
        _this.addChild(slide);

        slide.edit.open();
      });
    };

    return Slider;
  }(_block);

  return Slider;
});
//# sourceMappingURL=slider.js.map
