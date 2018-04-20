/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/block/block"], function (_uiEvents, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Product =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Product, _Block);

    function Product() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Product.prototype;

    /**
     * Bind events for the current instance
     */
    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _Block.prototype.bindEvents.call(this);

      _uiEvents.on("previewObservables:updated", function (args) {
        if (args.preview.id === _this.id) {
          var attributes = _this.data.main.attributes();

          if (attributes["data-sku"] === "") {
            return;
          }

          var url = _config.getInitConfig("preview_url");

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
  }(_block);

  return Product;
});
//# sourceMappingURL=product.js.map
