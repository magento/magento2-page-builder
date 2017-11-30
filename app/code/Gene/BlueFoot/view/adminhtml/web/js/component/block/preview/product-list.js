define(["./block", "../../config"], function (_block, _config) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ProductList =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(ProductList, _PreviewBlock);

    /**
     * Product constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function ProductList(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;

      _this.updateDataValue('html', '');

      _this.parent.stage.store.subscribe(function (data) {
        if (_this.data.category() === '') {
          return;
        }

        var url = _config.getInitConfig('preview_url'),
            requestData = {
          role: _this.config.name,
          product_count: data.product_count,
          hide_out_of_stock: data.hide_out_of_stock,
          category_id: data.category,
          is_preview: true
        };

        jQuery.post(url, requestData, function (response) {
          _this.updateDataValue('html', response.content !== undefined ? response.content.trim() : '');
        });
      }, _this.parent.id);

      return _this;
    }

    return ProductList;
  }(_block);

  return ProductList;
});
//# sourceMappingURL=product-list.js.map
