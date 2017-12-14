define(["./data-filter"], function (_dataFilter) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var StyleAttributeFilter =
  /*#__PURE__*/
  function (_DataFilter) {
    _inheritsLoose(StyleAttributeFilter, _DataFilter);

    // Allowed style attributes
    function StyleAttributeFilter() {
      var _this;

      _this = _DataFilter.call(this) || this;
      _this.allowedAttributes = void 0;
      _this.allowedAttributes = _this.toDataObject(['width', 'height', 'min_height', 'background_color', 'background_image', 'background_size', 'background_attachment', 'background_repeat', 'background_position', 'border_style', 'border_width', 'border_color', 'border_radius', 'margin_top', 'margin_right', 'margin_bottom', 'margin_left', 'padding_top', 'padding_right', 'padding_bottom', 'padding_left', 'display', 'align_self', 'text_align', 'color', 'border', 'margins_and_padding']);
      return _this;
    }

    return StyleAttributeFilter;
  }(_dataFilter);

  return StyleAttributeFilter;
});
//# sourceMappingURL=style-attribute-filter.js.map
