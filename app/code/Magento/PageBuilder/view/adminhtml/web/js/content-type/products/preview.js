/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "uiEvents", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _uiEvents, _config, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.displayPreview = _knockout.observable(false), _this.placeholderText = _knockout.observable((0, _translate)("Empty Products")), _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * Bind events
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When a products type is dropped for the first time open the edit panel


      _uiEvents.on("products:contentType:dropped:create", function (event, params) {
        if (event.id === _this2.parent.id) {
          setTimeout(function () {
            _this2.edit.open();
          }, 300);
        }
      });
    };

    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      var _this3 = this;

      _BasePreview.prototype.afterObservablesUpdated.call(this);

      this.placeholderText((0, _translate)("Loading..."));
      this.displayPreview(false);
      var data = this.parent.dataStore.get();

      if (typeof data.conditions_encoded !== "string" || data.conditions_encoded.length === 0) {
        return;
      }

      var url = _config.getConfig("preview_url");

      var requestConfig = {
        method: "GET",
        data: {
          role: this.config.name,
          directive: this.data.main.html()
        }
      };

      _jquery.ajax(url, requestConfig).done(function (response) {
        var content = response.content !== undefined ? response.content.trim() : "";

        if (content.length === 0) {
          _this3.placeholderText((0, _translate)("Empty Products"));

          return;
        }

        _this3.data.main.html(content);

        _this3.displayPreview(true);
      }).fail(function () {
        _this3.placeholderText((0, _translate)("An unknown error occurred. Please try again."));
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
