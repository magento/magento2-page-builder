/*eslint-disable */
define(["jquery", "knockout", "underscore", "./block"], function (_jquery, _knockout, _underscore, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Accordion =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Accordion, _PreviewBlock);

    /**
     * @param {Accordion} parent
     * @param {object} config
     * @param {Appearance} appearance
     */
    function Accordion(parent, config, appearance) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config, appearance) || this; // Declare our tabs, they'll get populated later

      _this.element = void 0;
      _this.renderCounter = 0;
      _this.data.items = _knockout.observableArray([]);

      _this.data.items.subscribe(function (data) {
        _this.renderCounter = 0;
        (0, _jquery)(_this.element).accordion("destroy");
      });

      return _this;
    }
    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */


    var _proto = Accordion.prototype;

    _proto.onContainerRender = function onContainerRender(element) {
      this.element = element;
    };
    /**
     * Callback after an item has been rendered, wait until all tabs have been rendered to init the widget
     */


    _proto.onItemRender = function onItemRender() {
      var _this2 = this;

      ++this.renderCounter;

      if (this.data.items().length === this.renderCounter) {
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

    return Accordion;
  }(_block);

  return Accordion;
});
//# sourceMappingURL=accordion.js.map
