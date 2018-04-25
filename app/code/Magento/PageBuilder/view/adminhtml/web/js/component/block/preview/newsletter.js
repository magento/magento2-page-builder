/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/preview", "Magento_PageBuilder/js/component/config"], function (_uiEvents, _preview, _config) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Newsletter =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(Newsletter, _Preview);

    function Newsletter() {
      return _Preview.apply(this, arguments) || this;
    }

    var _proto = Newsletter.prototype;

    /**
     * Bind events
     */
    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _Preview.prototype.bindEvents.call(this);

      _uiEvents.on("previewObservables:updated", function (args) {
        if (args.preview.parent.id === _this.parent.id) {
          var attributes = _this.data.main.attributes();

          if (attributes["data-title"] === "") {
            return;
          }

          var url = _config.getConfig("preview_url");

          var requestData = {
            button_text: attributes["data-button-text"],
            label_text: attributes["data-label-text"],
            placeholder: attributes["data-placeholder"],
            role: _this.config.name,
            title: attributes["data-title"]
          };
          jQuery.post(url, requestData, function (response) {
            _this.data.main.html(response.content !== undefined ? response.content.trim() : "");
          });
        }
      });
    };

    return Newsletter;
  }(_preview);

  return Newsletter;
});
//# sourceMappingURL=newsletter.js.map
