define(["./data-filter"], function (_dataFilter) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var AttributeFilter =
  /*#__PURE__*/
  function (_DataFilter) {
    _inheritsLoose(AttributeFilter, _DataFilter);

    // Allowed data attributes
    function AttributeFilter() {
      var _this;

      _this = _DataFilter.call(this) || this;
      _this.allowedAttributes = void 0;
      _this.allowedAttributes = _this.toDataObject(['name', 'appearance', 'id', 'src', 'button_text', 'label_text', 'placeholder', 'title', 'identifier', 'view_mode', 'sku', 'position', 'category_id', 'product_count', 'show_out_of_stock', 'autoplay', 'autoplay_speed', 'fade', 'is_infinite', 'show_arrows', 'show_dots', 'advanced_settings', 'has_overlay_background', 'enable_parallax', 'parallax_speed']);
      return _this;
    }

    return AttributeFilter;
  }(_dataFilter);

  return AttributeFilter;
});
//# sourceMappingURL=attribute-filter.js.map
