/*eslint-disable */
define(["jquery", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _config, _preview) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
     * @inheritdoc
     */
    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      var _this = this;

      _BasePreview.prototype.afterObservablesUpdated.call(this);

      var attributes = this.data.main.attributes();

      if (attributes["data-title"] === "") {
        return;
      }

      var url = _config.getConfig("preview_url");

      var requestData = {
        button_text: attributes["data-button-text"],
        label_text: attributes["data-label-text"],
        placeholder: attributes["data-placeholder"],
        role: this.config.name,
        title: attributes["data-title"]
      };

      _jquery.post(url, requestData, function (response) {
        if (_typeof(response.data) !== "object" || typeof response.data.content === "undefined") {
          return;
        }

        _this.data.main.html(response.data.content.trim());
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
