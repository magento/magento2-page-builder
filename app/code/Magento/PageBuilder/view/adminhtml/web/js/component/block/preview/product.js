/*eslint-disable */
define(["Magento_PageBuilder/js/preview", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/event-bus"], function (_preview, _config, _eventBus) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Product =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(Product, _Preview);

    function Product() {
      return _Preview.apply(this, arguments) || this;
    }

    var _proto = Product.prototype;

    /**
     * Bind events
     */
    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _Preview.prototype.bindEvents.call(this);

      _eventBus.on("previewObservables:updated", function (event, params) {
        if (params.preview.parent.id === _this.parent.id) {
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

    return Product;
  }(_preview);

  return Product;
});
//# sourceMappingURL=product.js.map
