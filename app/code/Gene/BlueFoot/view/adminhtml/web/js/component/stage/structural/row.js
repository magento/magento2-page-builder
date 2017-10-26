define(["./abstract", "./column", "./options/option", "ko-resizable"], function (_abstract, _column, _option, _koResizable) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * Row class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   *
   * @deprecated use component/block/row.
   */
  var Row =
  /*#__PURE__*/
  function (_Structural) {
    _inheritsLoose(Row, _Structural);

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    function Row(parent, stage) {
      var _this;

      _this = _Structural.call(this, parent, stage) || this;
      Object.defineProperty(_this, "previewTemplate", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 'Gene_BlueFoot/component/block/preview/row.html'
      });
      Object.defineProperty(_this, "renderTemplate", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 'Gene_BlueFoot/component/block/render/row.html'
      });

      _this.options.push(new _option.Option(_this, 'column', '<i></i>', 'Add Column', _this.addColumn.bind(_this), ['add-column'], 10));

      _this.config.role = 'row';
      _this.config.name = 'row';
      return _this;
    }
    /**
     * Add a column to the row
     *
     * @param data
     * @returns {any}
     */


    var _proto = Row.prototype;

    _proto.addColumn = function addColumn(data) {
      var column = new _column.Column(this, this.stage);
      column = this.onBlockDropped();
      this.addChild(column);
      column.updateColumnData(data);
      return column;
    };

    return Row;
  }(_abstract);

  return Row;
});