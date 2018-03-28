/*eslint-disable */
define(["../config", "./block"], function (_config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ProductList =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(ProductList, _Block);

    function ProductList() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = ProductList.prototype;

    _proto.afterDataRendered = function afterDataRendered() {
      var _this = this;

      var attributes = this.data.main.attributes();

      if (attributes['data-category-id'] === "") {
        return;
      }

      var url = _config.getInitConfig("preview_url");

      var requestData = {
        is_preview: true,
        role: this.config.name,
        category_id: attributes['data-category-id'],
        hide_out_of_stock: attributes['data-hide-out-of-stock'],
        product_count: attributes['data-product-count']
      };
      jQuery.post(url, requestData, function (response) {
        _this.data.main.html(response.content !== undefined ? response.content.trim() : "");
      });
    };

    return ProductList;
  }(_block);

  return ProductList;
});
//# sourceMappingURL=product-list.js.map
