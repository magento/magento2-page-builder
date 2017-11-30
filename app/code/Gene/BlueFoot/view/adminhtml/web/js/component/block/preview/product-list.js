define(["./block", "../../config"], function (_block, _config) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Product =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Product, _PreviewBlock);

    /**
     * Product constructor
     *
     * @param {Block} parent
     * @param {Object} config
     */
    function Product(parent, config) {
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
          productCount: data.product_count,
          hide: data.hide,
          categoryId: data.category,
          is_preview: true
        };

        jQuery.post(url, requestData, function (response) {
          debugger;

          _this.updateDataValue('html', response.content !== undefined ? response.content.trim() : '');
        });
      }, _this.parent.id);

      return _this;
    }

    return Product;
  }(_block);

  return Product;
});
//# sourceMappingURL=product-list.js.map
