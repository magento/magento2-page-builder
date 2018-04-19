/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/block/block"], function (_uiEvents, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ProductList =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(ProductList, _Block);

    function ProductList() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = ProductList.prototype;

    /**
     * Bind events for the current instance
     */
    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _Block.prototype.bindEvents.call(this);

      _uiEvents.on("previewObservables:updated", function (event, args) {
        if (args.preview.id === _this.id) {
          var attributes = _this.data.main.attributes();

          if (attributes["data-category-id"] === "") {
            return;
          }

          var url = _config.getInitConfig("preview_url");

          var requestData = {
            is_preview: true,
            role: _this.config.name,
            category_id: attributes["data-category-id"],
            hide_out_of_stock: attributes["data-hide-out-of-stock"],
            product_count: attributes["data-product-count"]
          };
          jQuery.post(url, requestData, function (response) {
            _this.data.main.html(response.content !== undefined ? response.content.trim() : "");
          });
        }
      });
    };

    return ProductList;
  }(_block);

  return ProductList;
});
//# sourceMappingURL=product-list.js.map
