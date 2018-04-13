/*eslint-disable */
define(["Magento_PageBuilder/js/preview", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/event-bus"], function (_preview, _config, _eventBus) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Newsletter =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(Newsletter, _Preview);

    function Newsletter() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Preview.call.apply(_Preview, [this].concat(args)) || this, _this.editOnInsert = false, _temp) || _this;
    }

    var _proto = Newsletter.prototype;

    /**
     * Bind events for the current instance
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _Preview.prototype.bindEvents.call(this);

      _eventBus.on("previewObservables:updated", function (event, params) {
        if (params.preview.id === _this2.id) {
          var attributes = _this2.data.main.attributes();

          if (attributes["data-title"] === "") {
            return;
          }

          var url = _config.getConfig("preview_url");

          var requestData = {
            button_text: attributes["data-button-text"],
            label_text: attributes["data-label-text"],
            placeholder: attributes["data-placeholder"],
            role: _this2.config.name,
            title: attributes["data-title"]
          };
          jQuery.post(url, requestData, function (response) {
            _this2.data.main.html(response.content !== undefined ? response.content.trim() : "");
          });
        }
      });
    };

    return Newsletter;
  }(_preview);

  return Newsletter;
});
//# sourceMappingURL=newsletter.js.map
