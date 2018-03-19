/*eslint-disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/resource/slick/slick", "underscore", "../../../utils/focus-binding", "../../event-bus", "./block"], function (_jquery, _knockout, _slick, _underscore, _focusBinding, _eventBus, _block) {
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
      _this.focusedSlide = _knockout.observable();
      _this.activeSlide = _knockout.observable(0);
      _this.element = void 0;
      _this.childSubscribe = void 0;
      _this.buildSlick = _underscore.debounce(function () {
        if (_this.element && _this.element.children.length > 0) {
          // Force the height to ensure no weird paint effects / content jumps are produced
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
            initialSlide: _this.activeSlide() || 0
          }, _this.buildSlickConfig())); // Update our KO pointer to the active slide on change

          (0, _jquery)(_this.element).on("beforeChange", function (event, slick, currentSlide, nextSlide) {
            _this.setActiveSlide(nextSlide);
          }).on("afterChange", function () {
            (0, _jquery)(_this.element).css({
              height: "",
              overflow: ""
            });
          });
        }
      }, 10);
      _this.childSubscribe = _this.parent.children.subscribe(_this.buildSlick);

      _this.parent.stage.store.subscribe(_this.buildSlick); // Set the active slide to the new position of the sorted slide


      _eventBus.on("previewSortable:sortupdate", function (event, params) {
        if (params.instance.id === _this.parent.id) {
          (0, _jquery)(params.ui.item).remove(); // Remove the item as the container's children is controlled by knockout

          _this.setActiveSlide(params.newPosition);
        }
      });

      _eventBus.on("slide:block:removed", function (event, params) {
        if (params.block.parent.id === _this.parent.id) {
          _this.forceContainerHeight();

          var data = _this.parent.children().slice(0);

          _this.parent.children([]);

          _this.parent.children(data);
        }
      });

      _eventBus.on("slide:block:create", function (event, params) {
        if (_this.element && params.block.parent.id === _this.parent.id) {
          _this.forceContainerHeight();
        }
      }); // Set the stage to interacting when a slide if focused


      _this.focusedSlide.subscribe(function (value) {
        _this.parent.stage.interacting(value !== null);
      });

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
      this.activeSlide(slideIndex);
    };
    /**
     * Set the focused slide
     *
     * @param {number} slideIndex
     * @param {boolean} force
     */


    _proto.setFocusedSlide = function setFocusedSlide(slideIndex, force) {
      if (force === void 0) {
        force = false;
      }

      if (force) {
        this.focusedSlide(null);
      }

      this.focusedSlide(slideIndex);
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
      this.setFocusedSlide(slideIndex);
    };
    /**
     * After child render record element
     *
     * @param {Element} element
     */


    _proto.afterChildrenRender = function afterChildrenRender(element) {
      _PreviewBlock.prototype.afterChildrenRender.call(this, element);

      this.element = element;
    };
    /**
     * To ensure smooth animations we need to lock the container height
     */


    _proto.forceContainerHeight = function forceContainerHeight() {
      (0, _jquery)(this.element).css({
        height: (0, _jquery)(this.element).outerHeight(),
        overflow: "hidden"
      });
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
