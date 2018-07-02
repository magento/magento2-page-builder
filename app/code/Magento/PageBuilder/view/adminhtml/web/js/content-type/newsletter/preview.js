/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_uiEvents, _config, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
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

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
