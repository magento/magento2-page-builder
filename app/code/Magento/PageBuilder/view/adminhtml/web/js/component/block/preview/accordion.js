/*eslint-disable */
define(["jquery", "underscore", "Magento_PageBuilder/js/component/block/preview/block"], function (_jquery, _underscore, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Accordion =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Accordion, _PreviewBlock);

    function Accordion() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewBlock.call.apply(_PreviewBlock, [this].concat(args)) || this, _this.element = void 0, _this.renderCounter = 0, _temp) || _this;
    }

    var _proto = Accordion.prototype;

    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    _proto.onContainerRender = function onContainerRender(element) {
      this.element = element;
    };
    /**
     * Callback after an item has been rendered, wait until all tabs have been rendered to init the widget
     */


    _proto.onItemRender = function onItemRender() {
      var _this2 = this;

      ++this.renderCounter;

      if (this.previewData.items().length === this.renderCounter) {
        require(["accordion"], function () {
          _underscore.delay(function () {
            return (0, _jquery)(_this2.element).accordion({
              active: _this2.parent.getActive()
            });
          }, 50);
        });

        this.renderCounter = 0;
      }
    };
    /**
     * Setup fields observables within the data class property
     */


    _proto.setupDataFields = function setupDataFields() {
      var _this3 = this;

      _PreviewBlock.prototype.setupDataFields.call(this);

      this.updateDataValue("items", []);
      this.previewData.items.subscribe(function (data) {
        _this3.renderCounter = 0;
        (0, _jquery)(_this3.element).accordion("destroy");
      });
    };

    return Accordion;
  }(_block);

  return Accordion;
});
//# sourceMappingURL=accordion.js.map
