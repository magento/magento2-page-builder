/*eslint-disable */
define(["knockout", "mage/translate", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/preview-collection", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/stage/structural/options/option"], function (_knockout, _translate, _contentTypeFactory, _previewCollection, _config, _eventBus, _option) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Buttons =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Buttons, _PreviewCollection);

    function Buttons() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewCollection.call.apply(_PreviewCollection, [this].concat(args)) || this, _this.isLiveEditing = _knockout.observable(false), _temp) || _this;
    }

    var _proto = Buttons.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _PreviewCollection.prototype.bindEvents.call(this);

      _eventBus.on("buttons:block:dropped:create", function (event, params) {
        if (params.id === _this2.parent.id && _this2.parent.children().length === 0) {
          _this2.addButton();
        }
      });
    };
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      var options = _PreviewCollection.prototype.retrieveOptions.call(this);

      options.push(new _option.Option(this, "add", "<i class='icon-pagebuilder-add'></i>", (0, _translate)("Add Button"), this.addButton, ["add-child"], 20));
      return options;
    };
    /**
     * Add button-item to buttons children array
     */


    _proto.addButton = function addButton() {
      var _this3 = this;

      var createButtonItemPromise = (0, _contentTypeFactory)(_config.getContentTypeConfig("button-item"), this.parent.parent, this.parent.stageId, {});
      createButtonItemPromise.then(function (button) {
        _this3.parent.addChild(button);

        _this3.isLiveEditing(_this3.parent.children().indexOf(button));

        return button;
      }).catch(function (error) {
        console.error(error);
      });
    };

    return Buttons;
  }(_previewCollection);

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
