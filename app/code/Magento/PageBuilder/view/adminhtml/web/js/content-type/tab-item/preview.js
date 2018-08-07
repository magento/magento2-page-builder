/*eslint-disable */
define(["Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type/preview-collection"], function (_events, _previewCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Preview, _PreviewCollection);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewCollection.call.apply(_PreviewCollection, [this].concat(args)) || this, _this.fieldsToIgnoreOnRemove = ["tab_name"], _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    _proto.getOptions = function getOptions() {
      var options = _PreviewCollection.prototype.getOptions.call(this);

      options.removeOption("move");
      options.removeOption("title");
      return options;
    };
    /**
     * Bind events
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _PreviewCollection.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":mountAfter", function (args) {
        if (args.id === _this2.parent.id) {
          // Disable the remove option when there is only a single tab
          var removeOption = _this2.getOptions().getOption("remove");

          if (_this2.parent.parent.children().length < 2) {
            removeOption.isDisabled(true);
          }

          _this2.parent.parent.children.subscribe(function (children) {
            removeOption.isDisabled(children.length < 2);
          });
        }
      });
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
