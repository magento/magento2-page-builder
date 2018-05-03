/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/preview"], function (_uiEvents, _config, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      return _BasePreview.apply(this, arguments) || this;
    }

    var _proto = Preview.prototype;

    /**
     * Bind events
     */
    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _BasePreview.prototype.bindEvents.call(this);

      _uiEvents.on("previewObservables:updated", function (args) {
        if (args.preview.parent.id === _this.parent.id) {
          var attributes = _this.data.main.attributes();

          if (attributes["data-sku"] === "") {
            return;
          }

          var url = _config.getConfig("preview_url");

          var requestData = {
            is_preview: true,
            role: _this.config.name,
            sku: attributes["data-sku"],
            view_mode: attributes["data-view-mode"]
          };
          jQuery.post(url, requestData, function (response) {
            _this.data.main.html(response.content !== undefined ? response.content.trim() : "");
          });
        }
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
