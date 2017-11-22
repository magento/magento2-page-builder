define(["./abstract", "./column", "./options/option", "ko-resizable"], function (_abstract, _column, _option, _koResizable) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @deprecated use component/block/row.
   */
  var Image =
  /*#__PURE__*/
  function (_Structural) {
    _inheritsLoose(Image, _Structural);

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    function Image(parent, stage) {
      var _this;

      _this = _Structural.call(this, parent, stage) || this;
      _this.previewTemplate = 'Gene_BlueFoot/component/block/preview/image.html';
      _this.renderTemplate = 'Gene_BlueFoot/component/block/render/image.html';
      _this.config.name = 'row';
      return _this;
    }
    /**
     * Append an add column option
     *
     * @returns {Array<Option>}
     */


    var _proto = Image.prototype;

    /**
     * Add a column to the row
     *
     * @param data
     * @returns {any}
     */
    _proto.addColumn = function addColumn(data) {
      var column = new _column.Column(this, this.stage);
      column = this.onBlockDropped();
      this.addChild(column);
      column.updateColumnData(data);
      return column;
    };

    _createClass(Image, [{
      key: "options",
      get: function get() {
        var options = _Structural.prototype.options;
        options.push(new _option.Option(this, 'column', '<i></i>', 'Add Column', this.addColumn, ['add-column'], 10));
        return options;
      }
    }]);

    return Image;
  }(_abstract);

  return Image;
});
//# sourceMappingURL=image.js.map
