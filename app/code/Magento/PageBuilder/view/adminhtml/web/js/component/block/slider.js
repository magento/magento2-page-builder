/*eslint-disable */
define(["mage/translate", "uiEvents", "underscore", "Magento_PageBuilder/js/component/block/factory", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/stage/structural/options/option", "Magento_PageBuilder/js/component/block/block"], function (_translate, _uiEvents, _underscore, _factory, _config, _option, _block) {
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
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */
    _proto.retrieveOptions = function retrieveOptions() {
      var options = _Block.prototype.retrieveOptions.call(this);

      options.push(new _option.Option(this, "add", "<i class='icon-pagebuilder-add'></i>", (0, _translate)("Add"), this.addSlide, ["add-child"], 10));
      return options;
    };
    /**
     * Add a slide into the slider
     */


    _proto.addSlide = function addSlide() {
      var _this = this;

      (0, _factory)(_config.getInitConfig("content_types").slide, this, this.stage).then(function (slide) {
        _underscore.delay(function () {
          _uiEvents.on("slide:block:mount", function (args) {
            if (args.id === slide.id) {
              _this.preview.navigateToSlide(_this.children().length - 1);

              _underscore.delay(function () {
                slide.edit.open();
              }, 500);

              _uiEvents.off("slide:block:mount:" + slide.id);
            }
          }, "slide:block:mount:" + slide.id);

          _this.addChild(slide, _this.children().length);
        });
      });
    };
    /**
     * Bind events for the current instance
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _Block.prototype.bindEvents.call(this); // Block being mounted onto container


      _uiEvents.on("slider:block:ready", function (args) {
        if (args.id === _this2.id && _this2.children().length === 0) {
          _this2.addSlide();
        }
      }); // Block being removed from container


      _uiEvents.on("slide:block:removed", function (args) {
        if (args.parent.id === _this2.id) {
          // Mark the previous slide as active
          var newIndex = args.index - 1 >= 0 ? args.index - 1 : 0;

          _this2.preview.setActiveSlide(newIndex);

          _this2.preview.setFocusedSlide(newIndex, true);
        }
      }); // Capture when a block is duplicated within the container


      var duplicatedSlide;
      var duplicatedSlideIndex;

      _uiEvents.on("slide:block:duplicate", function (args) {
        if (args.duplicate.parent.id === _this2.id) {
          duplicatedSlide = args.duplicate;
          duplicatedSlideIndex = args.index;
        }
      });

      _uiEvents.on("slide:block:mount", function (args) {
        if (duplicatedSlide && args.id === duplicatedSlide.id) {
          // Mark the new duplicate slide as active
          _this2.preview.navigateToSlide(duplicatedSlideIndex); // Force the focus of the slide, as the previous slide will have focus


          _this2.preview.setFocusedSlide(duplicatedSlideIndex, true);

          duplicatedSlide = duplicatedSlideIndex = null;
        }
      });
    };

    return Slider;
  }(_block);

  return Slider;
});
//# sourceMappingURL=slider.js.map
