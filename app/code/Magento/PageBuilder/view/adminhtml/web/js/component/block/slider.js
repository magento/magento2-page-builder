/*eslint-disable */
define(["mage/translate", "underscore", "Magento_PageBuilder/js/content-type-collection", "Magento_PageBuilder/js/component/block/factory", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/stage/structural/options/option"], function (_translate, _underscore, _contentTypeCollection, _factory, _config, _eventBus, _option) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Slider =
  /*#__PURE__*/
  function (_ContentTypeCollectio) {
    _inheritsLoose(Slider, _ContentTypeCollectio);

    function Slider() {
      return _ContentTypeCollectio.apply(this, arguments) || this;
    }

    var _proto = Slider.prototype;

    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */
    _proto.retrieveOptions = function retrieveOptions() {
      var options = _ContentTypeCollectio.prototype.retrieveOptions.call(this);

      options.push(new _option.Option(this, "add", "<i class='icon-pagebuilder-add'></i>", (0, _translate)("Add"), this.addSlide, ["add-child"], 10));
      return options;
    };
    /**
     * Add a slide into the slider
     */


    _proto.addSlide = function addSlide() {
      var _this = this;

      (0, _factory)(_config.getConfig("content_types").slide, this, this.stage).then(function (slide) {
        _underscore.delay(function () {
          var mountFn = function mountFn(event, params) {
            if (params.id === slide.id) {
              _this.preview.navigateToSlide(_this.children().length - 1);

              _underscore.delay(function () {
                slide.edit.open();
              }, 500);

              _eventBus.off("slide:block:mount", mountFn);
            }
          };

          _eventBus.on("slide:block:mount", mountFn);

          _this.addChild(slide, _this.children().length);
        });
      });
    };
    /**
     * Bind events for the current instance
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _ContentTypeCollectio.prototype.bindEvents.call(this); // Block being mounted onto container


      _eventBus.on("slider:block:ready", function (event, params) {
        if (params.id === _this2.id && _this2.children().length === 0) {
          _this2.addSlide();
        }
      }); // Block being removed from container


      _eventBus.on("slide:block:removed", function (event, params) {
        if (params.parent.id === _this2.id) {
          // Mark the previous slide as active
          var newIndex = params.index - 1 >= 0 ? params.index - 1 : 0;

          _this2.preview.setActiveSlide(newIndex);

          _this2.preview.setFocusedSlide(newIndex, true);
        }
      }); // Capture when a block is duplicated within the container


      var duplicatedSlide;
      var duplicatedSlideIndex;

      _eventBus.on("slide:block:duplicate", function (event, params) {
        if (params.duplicate.parent.id === _this2.id) {
          duplicatedSlide = params.duplicate;
          duplicatedSlideIndex = params.index;
        }
      });

      _eventBus.on("slide:block:mount", function (event, params) {
        if (duplicatedSlide && params.id === duplicatedSlide.id) {
          // Mark the new duplicate slide as active
          _this2.preview.navigateToSlide(duplicatedSlideIndex); // Force the focus of the slide, as the previous slide will have focus


          _this2.preview.setFocusedSlide(duplicatedSlideIndex, true);

          duplicatedSlide = duplicatedSlideIndex = null;
        }
      });
    };

    return Slider;
  }(_contentTypeCollection);

  return Slider;
});
//# sourceMappingURL=slider.js.map
