/*eslint-disable */
define(["jquery", "Magento_PageBuilder/js/resource/slick/slick", "underscore", "./block"], function (_jquery, _slick, _underscore, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Slider =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Slider, _PreviewBlock);

    /**
     * Assign a debounce and delay to the init of slick to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    function Slider(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.element = void 0;
      _this.childSubscribe = void 0;
      _this.buildSlick = _underscore.debounce(function () {
        if (_this.element && _this.element.children.length > 0) {
          try {
            (0, _jquery)(_this.element).slick("unslick");
          } catch (e) {} // We aren't concerned if this fails, slick throws an Exception when we cannot unslick
          // Dispose current subscription in order to prevent infinite loop


          _this.childSubscribe.dispose(); // Force an update on all children, ko tries to intelligently re-render but fails


          var data = _this.parent.children().slice(0);

          _this.parent.children([]);

          (0, _jquery)(_this.element).empty();

          _this.parent.children(data); // Re-subscribe original event


          _this.childSubscribe = _this.parent.children.subscribe(_this.buildSlick); // Build slick

          (0, _jquery)(_this.element).slick(Object.assign({
            initialSlide: _this.data.activeSlide() || 0
          }, _this.buildSlickConfig())); // Update our KO pointer to the active slide on change

          (0, _jquery)(_this.element).on("beforeChange", function (event, slick, currentSlide, nextSlide) {
            _this.setActiveSlide(nextSlide);
          });
        }
      }, 10);
      _this.childSubscribe = _this.parent.children.subscribe(_this.buildSlick);

      _this.parent.stage.store.subscribe(_this.buildSlick);

      return _this;
    }
    /**
     * Capture an after render event
     */


    var _proto = Slider.prototype;

    _proto.onAfterRender = function onAfterRender() {
      this.buildSlick();
    };
    /**
     * Set an active slide for navigation dot
     *
     * @param slideIndex
     */


    _proto.setActiveSlide = function setActiveSlide(slideIndex) {
      this.data.activeSlide(slideIndex);
    };
    /**
     * Navigate to a slide
     *
     * @param {number} slideIndex
     * @param {boolean} dontAnimate
     */


    _proto.navigateToSlide = function navigateToSlide(slideIndex, dontAnimate) {
      if (dontAnimate === void 0) {
        dontAnimate = false;
      }

      (0, _jquery)(this.element).slick("slickGoTo", slideIndex, dontAnimate);
      this.setActiveSlide(slideIndex);
    };
    /**
     * After child render record element
     *
     * @param {Element} element
     */


    _proto.afterChildrenRender = function afterChildrenRender(element) {
      this.element = element;
    };
    /**
     * Setup fields observables within the data class property
     */


    _proto.setupDataFields = function setupDataFields() {
      _PreviewBlock.prototype.setupDataFields.call(this);

      this.updateDataValue("activeSlide", 0);
    };
    /**
     * Build the slack config object
     *
     * @returns {{autoplay: boolean; autoplaySpeed: (any | number);
     * fade: boolean; infinite: boolean; arrows: boolean; dots: boolean}}
     */


    _proto.buildSlickConfig = function buildSlickConfig() {
      return {
        arrows: this.data.show_arrows() === "1",
        autoplay: this.data.autoplay() === "1",
        autoplaySpeed: this.data.autoplay_speed(),
        dots: false,
        // We have our own dots implemented
        fade: this.data.fade() === "1",
        infinite: this.data.is_infinite() === "1"
      };
    };

    return Slider;
  }(_block);

  return Slider;
});
//# sourceMappingURL=slider.js.map
