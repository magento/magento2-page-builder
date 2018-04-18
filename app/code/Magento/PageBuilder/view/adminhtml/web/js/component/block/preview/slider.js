/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/resource/slick/slick.min", "underscore", "Magento_PageBuilder/js/binding/focus", "Magento_PageBuilder/js/preview-collection", "Magento_PageBuilder/js/component/block/factory", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/stage/structural/options/option"], function (_jquery, _knockout, _translate, _slick, _underscore, _focus, _previewCollection, _factory, _config, _eventBus, _option) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Slider =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Slider, _PreviewCollection);

    /**
     * Assign a debounce and delay to the init of slick to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Slider(parent, config, observableUpdater) {
      var _this;

      _this = _PreviewCollection.call(this, parent, config, observableUpdater) || this; // We only start forcing the containers height once the slider is ready

      _this.focusedSlide = _knockout.observable();
      _this.activeSlide = _knockout.observable(0);
      _this.element = void 0;
      _this.childSubscribe = void 0;
      _this.blockHeightReset = void 0;
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
            initialSlide: _this.activeSlide() || 0
          }, _this.buildSlickConfig())); // Update our KO pointer to the active slide on change

          (0, _jquery)(_this.element).on("beforeChange", function (event, slick, currentSlide, nextSlide) {
            _this.setActiveSlide(nextSlide);
          }).on("afterChange", function () {
            if (!_this.blockHeightReset) {
              (0, _jquery)(_this.element).css({
                height: "",
                overflow: ""
              });
              _this.blockHeightReset = null;
            }
          });
        }
      }, 10);
      var sliderReady = false;

      _eventBus.on("slider:block:ready", function (event, params) {
        if (params.id === _this.parent.id) {
          sliderReady = true;
        }
      });

      _this.childSubscribe = _this.parent.children.subscribe(_this.buildSlick);

      _this.parent.store.subscribe(_this.buildSlick); // Set the active slide to the new position of the sorted slide


      _eventBus.on("previewSortable:sortupdate", function (event, params) {
        if (params.instance.id === _this.parent.id) {
          (0, _jquery)(params.ui.item).remove(); // Remove the item as the container's children is controlled by knockout

          _this.setActiveSlide(params.newPosition);
        }
      }); // When a slide block is removed we need to force update the content of the slider due to KO rendering issues


      _eventBus.on("slide:block:removed", function (event, params) {
        if (params.block.parent.id === _this.parent.id) {
          _this.forceContainerHeight();

          var data = _this.parent.children().slice(0);

          _this.parent.children([]);

          _this.parent.children(data);
        }
      }); // On a slide blocks creation we need to lock the height of the slider to ensure a smooth transition


      _eventBus.on("slide:block:create", function (event, params) {
        if (_this.element && sliderReady && params.block.parent.id === _this.parent.id) {
          _this.forceContainerHeight();
        }
      }); // Set the stage to interacting when a slide is focused


      _this.focusedSlide.subscribe(function (value) {
        _this.parent.parent.parent.interacting(value !== null);
      });

      return _this;
    }
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    var _proto = Slider.prototype;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _PreviewCollection.prototype.retrieveOptions.call(this);

      options.push(new _option.Option(this, "add", "<i class='icon-pagebuilder-add'></i>", (0, _translate)("Add"), this.addSlide, ["add-child"], 10));
      return options;
    };
    /**
     * Capture an after render event
     */


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
     * @param {boolean} force
     */


    _proto.navigateToSlide = function navigateToSlide(slideIndex, dontAnimate, force) {
      if (dontAnimate === void 0) {
        dontAnimate = false;
      }

      if (force === void 0) {
        force = false;
      }

      (0, _jquery)(this.element).slick("slickGoTo", slideIndex, dontAnimate);
      this.setActiveSlide(slideIndex);
      this.setFocusedSlide(slideIndex, force);
    };
    /**
     * After child render record element
     *
     * @param {Element} element
     */


    _proto.afterChildrenRender = function afterChildrenRender(element) {
      _PreviewCollection.prototype.afterChildrenRender.call(this, element);

      this.element = element;
    };
    /**
     * On sort start force the container height, also focus to that slide
     *
     * @param {Event} event
     * @param {JQueryUI.SortableUIParams} params
     */


    _proto.onSortStart = function onSortStart(event, params) {
      this.forceContainerHeight();

      if (this.activeSlide() !== params.item.index() || this.focusedSlide() !== params.item.index()) {
        this.navigateToSlide(params.item.index(), false, true); // As we've completed a navigation request we need to ensure we don't remove the forced height

        this.blockHeightReset = true;
      }
    };
    /**
     * On sort stop ensure the focused slide and the active slide are in sync, as the focus can be lost in this
     * operation
     */


    _proto.onSortStop = function onSortStop() {
      if (this.activeSlide() !== this.focusedSlide()) {
        this.setFocusedSlide(this.activeSlide(), true);
      }
    };
    /**
     * Add a slide into the slider
     */


    _proto.addSlide = function addSlide() {
      var _this2 = this;

      (0, _factory)(_config.getConfig("content_types").slide, this.parent, this.parent.stageId).then(function (slide) {
        _underscore.delay(function () {
          var mountFn = function mountFn(event, params) {
            if (params.id === slide.id) {
              _this2.navigateToSlide(_this2.parent.children().length - 1);

              _underscore.delay(function () {
                slide.preview.onOptionEdit();
              }, 500);

              _eventBus.off("slide:block:mount", mountFn);
            }
          };

          _eventBus.on("slide:block:mount", mountFn);

          _this2.parent.addChild(slide, _this2.parent.children().length);
        });
      });
    };
    /**
     * Bind events for the current instance
     */


    _proto.bindEvents = function bindEvents() {
      var _this3 = this;

      _PreviewCollection.prototype.bindEvents.call(this); // Block being mounted onto container


      _eventBus.on("slider:block:ready", function (event, params) {
        if (params.id === _this3.parent.id && _this3.parent.children().length === 0) {
          _this3.addSlide();
        }
      }); // Block being removed from container


      _eventBus.on("slide:block:removed", function (event, params) {
        if (params.parent.id === _this3.id) {
          // Mark the previous slide as active
          var newIndex = params.index - 1 >= 0 ? params.index - 1 : 0;

          _this3.setActiveSlide(newIndex);

          _this3.setFocusedSlide(newIndex, true);
        }
      }); // Capture when a block is duplicated within the container


      var duplicatedSlide;
      var duplicatedSlideIndex;

      _eventBus.on("slide:block:duplicate", function (event, params) {
        if (params.duplicate.parent.id === _this3.id) {
          duplicatedSlide = params.duplicate;
          duplicatedSlideIndex = params.index;
        }
      });

      _eventBus.on("slide:block:mount", function (event, params) {
        if (duplicatedSlide && params.id === duplicatedSlide.id) {
          // Mark the new duplicate slide as active
          _this3.navigateToSlide(duplicatedSlideIndex); // Force the focus of the slide, as the previous slide will have focus


          _this3.setFocusedSlide(duplicatedSlideIndex, true);

          duplicatedSlide = duplicatedSlideIndex = null;
        }
      });
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
      var data = this.parent.store.get(this.parent.id);
      return {
        arrows: data.show_arrows === "1",
        autoplay: data.autoplay === "1",
        autoplaySpeed: data.autoplay_speed,
        dots: false,
        // We have our own dots implemented
        fade: data.fade === "1",
        infinite: data.is_infinite === "1"
      };
    };

    return Slider;
  }(_previewCollection);

  return Slider;
});
//# sourceMappingURL=slider.js.map
