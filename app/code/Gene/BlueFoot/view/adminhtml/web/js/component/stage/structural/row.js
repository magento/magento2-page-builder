define(["./abstract", "./column", "./options/option", "ko-resizable"], function (_abstract, _column, _option, _koResizable) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _inherits(Row, _Structural);

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    function Row(parent, stage) {
      var _this;

      _classCallCheck(this, Row);

      _this = _possibleConstructorReturn(this, (Row.__proto__ || Object.getPrototypeOf(Row)).call(this, parent, stage));
      _this.previewTemplate = 'Gene_BlueFoot/component/block/preview/row.html';
      _this.renderTemplate = 'Gene_BlueFoot/component/block/render/row.html';

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


    _createClass(Row, [{
      key: "addColumn",
      value: function addColumn(data) {
        var column = new _column.Column(this, this.stage);
        column = this.onBlockDropped();
        this.addChild(column);
        column.updateColumnData(data);
        return column;
      }
    }]);

    return Row;
  }(_abstract);

  return Row;
});
//# sourceMappingURL=row.js.map
