define(["./block", "Gene_BlueFoot/js/resource/slick/slick"], function (_block, _slick) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var AdvancedSlider =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(AdvancedSlider, _PreviewBlock);

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    function AdvancedSlider(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.element = void 0;
      _this.ready = false;
      parent.children.subscribe(_.debounce(function () {
        //$(this.element).slick(this.buildSlickConfig());
        _this.ready = true;
      }, 10));

      _this.parent.stage.store.subscribe(function (data) {
        if (_this.ready) {//$(this.element).slick(this.buildSlickConfig());
        }
      });

      return _this;
    }
    /**
     * After child render record element
     *
     * @param {Element} element
     */


    var _proto = AdvancedSlider.prototype;

    _proto.afterChildrenRender = function afterChildrenRender(element) {
      this.element = element;
    };
    /**
     * Build the slack config object
     *
     * @returns {{autoplay: boolean; autoplaySpeed: (any | number); fade: boolean; infinite: boolean; arrows: boolean; dots: boolean}}
     */


    _proto.buildSlickConfig = function buildSlickConfig() {
      return {
        autoplay: this.data.autoplay() === '1',
        autoplaySpeed: this.data.autoplay_speed(),
        fade: this.data.fade() === '1',
        infinite: this.data.is_infinite() === '1',
        arrows: this.data.show_arrows() === '1',
        dots: this.data.show_dots() === '1'
      };
    };

    return AdvancedSlider;
  }(_block);

  return AdvancedSlider;
});
//# sourceMappingURL=advanced-slider.js.map
