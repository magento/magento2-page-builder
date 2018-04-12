/*eslint-disable */
define(["jquery", "tabs", "underscore", "Magento_PageBuilder/js/component/block/preview/block"], function (_jquery, _tabs, _underscore, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Tabs =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Tabs, _PreviewBlock);

    function Tabs() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewBlock.call.apply(_PreviewBlock, [this].concat(args)) || this, _this.element = void 0, _this.renderCounter = 0, _temp) || _this;
    }

    var _proto = Tabs.prototype;

    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    _proto.onContainerRender = function onContainerRender(element) {
      this.element = element;
    };
    /**
     * Callback after a tab has been rendered, wait until all tabs have been rendered to init the widget
     */


    _proto.onTabRender = function onTabRender() {
      var _this2 = this;

      ++this.renderCounter;

      if (this.previewData.tabs().length === this.renderCounter) {
        _underscore.delay(function () {
          return (0, _jquery)(_this2.element).tabs();
        }, 50);

        this.renderCounter = 0;
      }
    };
    /**
     * Setup fields observables within the data class property
     */


    _proto.setupDataFields = function setupDataFields() {
      var _this3 = this;

      _PreviewBlock.prototype.setupDataFields.call(this);

      this.updateDataValue("tabs", []);
      this.previewData.tabs.subscribe(function (data) {
        _this3.renderCounter = 0;
        (0, _jquery)(_this3.element).tabs("destroy");
      });
    };

    return Tabs;
  }(_block);

  return Tabs;
});
//# sourceMappingURL=tabs.js.map
