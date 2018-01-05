/*eslint-disable */
define(["./block", "../config", "../block/factory"], function (_block, _config, _factory) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  'use strict';

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

      (0, _factory)(_config.getInitConfig('contentTypes')['slide'], this.parent, this.stage, {}).then(function (slide) {
        _this.addChild(slide);

        slide.edit.open();
      });
    };

    return AdvancedSlider;
  }(_block);

  return AdvancedSlider;
});
//# sourceMappingURL=advanced-slider.js.map
