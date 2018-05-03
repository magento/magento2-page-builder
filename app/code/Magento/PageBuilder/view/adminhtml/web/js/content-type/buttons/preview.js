/*eslint-disable */
define(["knockout", "mage/translate", "uiEvents", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/component/stage/structural/options/option", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/preview-collection"], function (_knockout, _translate, _uiEvents, _config, _option, _contentTypeFactory, _previewCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Preview, _PreviewCollection);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewCollection.call.apply(_PreviewCollection, [this].concat(args)) || this, _this.isLiveEditing = _knockout.observable(false), _temp) || _this;
    }

    var _proto = Preview.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _PreviewCollection.prototype.bindEvents.call(this);

      _uiEvents.on("buttons:block:dropped:create", function (args) {
        if (args.id === _this2.parent.id && _this2.parent.children().length === 0) {
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

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
