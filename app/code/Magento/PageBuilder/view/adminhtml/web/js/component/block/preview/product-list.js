/*eslint-disable */
define(["Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/block/preview/block"], function (_config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ProductList =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(ProductList, _PreviewBlock);

    function ProductList() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = ProductList.prototype;

    /**
     * Setup fields observables within the data class property
     */
    _proto.setupDataFields = function setupDataFields() {
      var _this = this;

      _PreviewBlock.prototype.setupDataFields.call(this);

      this.updateDataValue("html", "");
      this.parent.stage.store.subscribe(function (data) {
        if (_this.data.category_id() === "") {
          return;
        }

        var url = _config.getInitConfig("preview_url");

        var requestData = {
          category_id: data.category_id,
          hide_out_of_stock: data.hide_out_of_stock,
          is_preview: true,
          product_count: data.product_count,
          role: _this.config.name
        };
        jQuery.post(url, requestData, function (response) {
          _this.updateDataValue("html", response.content !== undefined ? response.content.trim() : "");
        });
      }, this.parent.id);
    };

    return ProductList;
  }(_block);

  return ProductList;
});
//# sourceMappingURL=product-list.js.map
