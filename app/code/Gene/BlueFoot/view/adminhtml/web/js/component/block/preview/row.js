define(["knockout", "./block"], function (_knockout, _block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Row =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Row, _PreviewBlock);

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    function Row(parent, config) {
      var _this;

      _this = _PreviewBlock.call(this, parent, config) || this;
      _this.rowStyles = void 0;
      _this.rowClasses = void 0;
      _this.rowStyles = _knockout.computed(function () {
        var data = _this.data;
        var backgroundImage = data.background_image && _typeof(data.background_image()[0]) === 'object' ? 'url(' + data.background_image()[0].url + ')' : '';
        var margin, padding;

        if (data.margins_and_padding && _typeof(data.margins_and_padding()) === 'object') {
          var m = data.margins_and_padding().margin;
          var p = data.margins_and_padding().padding;
          margin = m.top + "px " + m.right + "px " + m.bottom + "px " + m.left + "px";
          padding = p.top + "px " + p.right + "px " + p.bottom + "px " + p.left + "px";
        } else {
          margin = '';
          padding = '';
        }

        return {
          backgroundImage: backgroundImage,
          margin: margin,
          padding: padding,
          backgroundAttachment: data.background_attachment(),
          backgroundColor: data.background_color(),
          backgroundPosition: data.background_position(),
          backgroundRepeat: data.background_repeat(),
          backgroundSize: data.background_size(),
          border: data.border(),
          borderColor: data.border_color(),
          borderRadius: data.border_radius(),
          borderWidth: data,
          color: data.color,
          textAlign: data.text_align()
        };
      });
      _this.rowClasses = _knockout.computed(function () {
        return _this.data.css_classes();
      });
      return _this;
    }

    return Row;
  }(_block);

  return Row;
});
//# sourceMappingURL=row.js.map
