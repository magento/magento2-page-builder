/*eslint-disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _events, _config, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.displayPreview = _knockout.observable(false), _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * Bind events
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When a products type is dropped for the first time open the edit panel


      _events.on("products:dropAfter", function (args) {
        if (args.id === _this2.parent.id) {
          setTimeout(function () {
            _this2.edit.open();
          }, 300);
        }
      });

      _events.on("previewData:updateAfter", function (event, params) {
        if (event.preview.parent.id !== _this2.parent.id) {
          return;
        }

        _this2.displayPreview(false);

        var data = _this2.parent.dataStore.get();

        if (typeof data.conditions_encoded !== "string" || data.conditions_encoded.length === 0) {
          return;
        }

        var url = _config.getConfig("preview_url");

        var requestData = {
          role: _this2.config.name,
          directive: _this2.data.main.html()
        };

        _jquery.post(url, requestData, function (response) {
          var content = response.content !== undefined ? response.content.trim() : "";

          if (content.length === 0) {
            return;
          }

          _this2.data.main.html(content);

          _this2.displayPreview(true);
        });
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
