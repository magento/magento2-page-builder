/*eslint-disable */
define(["../block/factory", "../config", "./block"], function (_factory, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var AdvancedSlider =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(AdvancedSlider, _Block);

    function AdvancedSlider() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = AdvancedSlider.prototype;

    /**
     * Add a slide into the slider
     */
    _proto.addSlide = function addSlide() {
      var _this = this;

      var slideKey = "slide";
      (0, _factory)(_config.getInitConfig("contentTypes")[slideKey], this.parent, this.stage, {}).then(function (slide) {
        _this.addChild(slide);

        slide.edit.open();
      });
    };

    return AdvancedSlider;
  }(_block);

  return AdvancedSlider;
});
//# sourceMappingURL=advanced-slider.js.map
