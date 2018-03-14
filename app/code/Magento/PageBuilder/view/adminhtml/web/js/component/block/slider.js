/*eslint-disable */
define(["../../utils/delayed-promise", "../block/factory", "../config", "../event-bus", "./block", "mage/translate", "../stage/structural/options/option"], function (_delayedPromise, _factory, _config, _eventBus, _block, _translate, _option) {
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

      options.push(new _option.Option(this, "add", "<i class='icon-pagebuilder-add'></i>", (0, _translate)("Add"), this.addSlide, ["add-slider"], 10));
      return options;
    };
    /**
     * Add a slide into the slider
     */


    _proto.addSlide = function addSlide() {
      var _this = this;

      // Set the active slide to the index of the new slide we're creating
      this.preview.data.activeSlide(this.children().length);
      (0, _factory)(_config.getInitConfig("content_types").slide, this, this.stage).then((0, _delayedPromise)(300)).then(function (slide) {
        _this.addChild(slide, _this.children().length);

        slide.edit.open();
      });
    };
    /**
     * Bind events for the current instance
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _Block.prototype.bindEvents.call(this); // Block being mounted onto container


      _eventBus.on("slider:block:ready", function (event, params) {
        if (params.id === _this2.id && _this2.children().length === 0) {
          _this2.addSlide();
        }
      }); // Block being removed from container


      _eventBus.on("block:removed", function (event, params) {
        if (params.parent.id === _this2.id) {
          // Mark the previous slide as active
          _this2.preview.data.activeSlide(params.index - 1);
        }
      });
    };

    return Slider;
  }(_block);

  return Slider;
});
//# sourceMappingURL=slider.js.map
