define(["./block", "knockout", "jquery", "underscore", "tabs"], function (_block, _knockout, _jquery, _underscore, _tabs) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Tabs =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Tabs, _Block);

    function Tabs(parent, config) {
      var _this;

      _this = _Block.call(this, parent, config) || this; // Declare our tabs, they'll get populated later

      _this.element = void 0;
      _this.renderCounter = 0;
      _this.data.tabs = _knockout.observableArray([]);

      _this.data.tabs.subscribe(function (data) {
        _this.renderCounter = 0;
        (0, _jquery)(_this.element).tabs('destroy');
      });

      return _this;
    }
    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */


    var _proto = Tabs.prototype;

    _proto.onContainerRender = function onContainerRender(element) {
      this.element = element;
    };
    /**
     * Callback after a tab has been rendered, wait until all tabs have been rendered to init the widget
     */


    _proto.onTabRender = function onTabRender() {
      var _this2 = this;

      ++this.renderCounter;

      if (this.data.tabs().length === this.renderCounter) {
        _underscore.delay(function () {
          return (0, _jquery)(_this2.element).tabs();
        }, 50);

        this.renderCounter = 0;
      }
    };

    return Tabs;
  }(_block);

  return Tabs;
});
//# sourceMappingURL=tabs.js.map
