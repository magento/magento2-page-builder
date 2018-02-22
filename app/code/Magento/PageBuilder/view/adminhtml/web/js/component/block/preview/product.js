/*eslint-disable */
define(["../../config", "./block"], function (_config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Product =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Product, _PreviewBlock);

    function Product() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Product.prototype;

    /**
     * Setup fields observables within the data class property
     */
    _proto.setupDataFields = function setupDataFields() {
      var _this = this;

      _PreviewBlock.prototype.setupDataFields.call(this);

      this.updateDataValue("html", "");
      this.parent.stage.store.subscribe(function (data) {
        if (_this.data.sku() === "") {
          return;
        }

        var url = _config.getInitConfig("preview_url");

        var requestData = {
          is_preview: true,
          role: _this.config.name,
          sku: _this.data.sku,
          view_mode: _this.data.view_mode
        };
        jQuery.post(url, requestData, function (response) {
          _this.updateDataValue("html", response.content !== undefined ? response.content.trim() : "");
        });
      }, this.parent.id);
    };

    return Product;
  }(_block);

  return Product;
});
//# sourceMappingURL=product.js.map
