/*eslint-disable */
define(["Magento_PageBuilder/js/preview", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/event-bus"], function (_preview, _config, _eventBus) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ProductList =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(ProductList, _Preview);

    function ProductList() {
      return _Preview.apply(this, arguments) || this;
    }

    var _proto = ProductList.prototype;

    /**
     * Bind events
     */
    _proto.bindEvents = function bindEvents() {
      var _this = this;

      _Preview.prototype.bindEvents.call(this);

      _eventBus.on("previewObservables:updated", function (event, params) {
        if (params.preview.id === _this.id) {
          var attributes = _this.data.main.attributes();

          if (attributes["data-category-id"] === "") {
            return;
          }

          var url = _config.getConfig("preview_url");

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
  }(_preview);

  return ProductList;
});
//# sourceMappingURL=product-list.js.map
