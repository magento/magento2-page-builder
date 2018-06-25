/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/resource/slick/slick.min", "uiEvents", "underscore", "Magento_PageBuilder/js/binding/focus", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/content-type/preview-collection"], function (_jquery, _knockout, _translate, _slick, _uiEvents, _underscore, _focus, _config, _contentTypeFactory, _option, _previewCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Preview, _PreviewCollection);

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
    function Preview(parent, config, observableUpdater) {
      var _this;

      _this = _PreviewCollection.call(this, parent, config, observableUpdater) || this;
      _this.focusedSlide = _knockout.observable();
      _this.activeSlide = _knockout.observable(0);
      _this.element = void 0;
      _this.childSubscribe = void 0;
      _this.contentTypeHeightReset = void 0;
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
            if (!_this.contentTypeHeightReset) {
              (0, _jquery)(_this.element).css({
                height: "",
                overflow: ""
              });
              _this.contentTypeHeightReset = null;
            }
          });
        }
      }, 10);
      _this.childSubscribe = _this.parent.children.subscribe(_this.buildSlick);

      _this.parent.dataStore.subscribe(_this.buildSlick); // Set the stage to interacting when a slide is focused


      _this.focusedSlide.subscribe(function (value) {
        if (value !== null) {
          _uiEvents.trigger("stage:interactionStart");
        } else {
          _uiEvents.trigger("stage:interactionStop");
        }
      });

      return _this;
    }
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    var _proto = Preview.prototype;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _PreviewCollection.prototype.retrieveOptions.call(this);

      options.push(new _option(this, "add", "<i class='icon-pagebuilder-add'></i>", (0, _translate)("Add"), this.addSlide, ["add-child"], 10));
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

        this.contentTypeHeightReset = true;
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

      (0, _contentTypeFactory)(_config.getConfig("content_types").slide, this.parent, this.parent.stageId).then(function (slide) {
        _uiEvents.on("slide:mountAfter", function (args) {
          if (args.id === slide.id) {
            _underscore.delay(function () {
              _this2.navigateToSlide(_this2.parent.children().length - 1);

              slide.preview.onOptionEdit();
            }, 500);

            _uiEvents.off("slide:mountAfter:" + slide.id);
          }
        }, "slide:mountAfter:" + slide.id);

        _this2.parent.addChild(slide, _this2.parent.children().length);
      });
    };
    /**
     * Slider can not receive drops by default
     *
     * @returns {boolean}
     */


    _proto.isContainer = function isContainer() {
      return false;
    };
    /**
     * Bind events
     */


    _proto.bindEvents = function bindEvents() {
      var _this3 = this;

      _PreviewCollection.prototype.bindEvents.call(this); // We only start forcing the containers height once the slider is ready


      var sliderReady = false;

      _uiEvents.on("slider:contentType:ready", function (args) {
        if (args.id === _this3.parent.id) {
          sliderReady = true;
        }
      }); // Set the active slide to the new position of the sorted slide


      _uiEvents.on("sortableChildren:sortupdate", function (args) {
        if (args.instance.id === _this3.parent.id) {
          (0, _jquery)(args.ui.item).remove(); // Remove the item as the container's children is controlled by knockout

          _this3.setActiveSlide(args.newPosition);
        }
      }); // When a slide content type is removed
      // we need to force update the content of the slider due to KO rendering issues


      var newItemIndex;

      _uiEvents.on("slide:contentType:removeAfter", function (args) {
        if (args.contentType.parent.id === _this3.parent.id) {
          // Mark the previous slide as active
          newItemIndex = args.index - 1 >= 0 ? args.index - 1 : 0;

          _this3.forceContainerHeight();

          var data = _this3.parent.children().slice(0);

          _this3.parent.children([]);

          _this3.parent.children(data);
        }
      });

      _uiEvents.on("slide:contentType:afterRender", function (args) {
        var itemIndex = args.contentType.parent.getChildren()().indexOf(args.contentType);

        if (args.contentType.parent.id === _this3.parent.id && newItemIndex !== null && newItemIndex === itemIndex) {
          _underscore.defer(function () {
            if (newItemIndex !== null) {
              newItemIndex = null;

              _this3.navigateToSlide(itemIndex, true, true);

              _underscore.defer(function () {
                _this3.focusedSlide(null);

                _this3.focusedSlide(itemIndex);
              });
            }
          });
        }
      }); // On a slide content types creation we need to lock the height of the slider to ensure a smooth transition


      _uiEvents.on("slide:contentType:create", function (args) {
        if (_this3.element && sliderReady && args.contentType.parent.id === _this3.parent.id) {
          _this3.forceContainerHeight();
        }
      }); // ContentType being mounted onto container


      _uiEvents.on("slider:createAfter", function (args) {
        if (args.id === _this3.parent.id && _this3.parent.children().length === 0) {
          _this3.addSlide();
        }
      }); // Capture when a content type is duplicated within the container


      var duplicatedSlide;
      var duplicatedSlideIndex;

      _uiEvents.on("slide:duplicateAfter", function (args) {
        if (args.duplicateContentType.parent.id === _this3.parent.id) {
          duplicatedSlide = args.duplicateContentType;
          duplicatedSlideIndex = args.index;
        }
      });

      _uiEvents.on("slide:mountAfter", function (args) {
        if (duplicatedSlide && args.id === duplicatedSlide.id) {
          _underscore.defer(function () {
            // Mark the new duplicate slide as active
            _this3.navigateToSlide(duplicatedSlideIndex, true, true);

            duplicatedSlide = duplicatedSlideIndex = null;
          });
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
      var data = this.parent.dataStore.get();
      return {
        arrows: data.show_arrows === "1",
        autoplay: data.autoplay === "1",
        autoplaySpeed: data.autoplay_speed,
        dots: false,
        // We have our own dots implemented
        fade: data.fade === "1",
        infinite: data.is_infinite === "1",
        waitForAnimate: false
      };
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
