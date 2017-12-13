define(["underscore", "ko-resizable", "./abstract", "./column", "./options/option"], function (_underscore, _koResizable, _abstract, _column, _option) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
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
      _this.previewTemplate = 'Gene_BlueFoot/component/block/preview/row.html';
      _this.renderTemplate = 'Gene_BlueFoot/component/block/render/row.html';
      _this.config.name = 'row';
      return _this;
    }
    /**
     * Append an add column option
     *
     * @returns {Array<Option>}
     */


    var _proto = Row.prototype;

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
    /**
     * Get stype properties for an block
     * Example {'backgroundColor': '#cccccc'}
     *
     * @returns {DataObject}
     */


    _proto.getStyle = function getStyle() {
      var children = this.children();
      var styleAttributes = {},
          isAllColumns = true;

      if (children.length !== 0) {
        for (var i = 0; i < children.length; i++) {
          if (children[i].config.name !== 'column') {
            isAllColumns = false;
          }
        }
      } else {
        isAllColumns = false;
      }

      if (isAllColumns) {
        styleAttributes['display'] = 'flex';
      }

      return _underscore.extend(_Structural.prototype.getStyle.call(this), styleAttributes);
    };

    _createClass(Row, [{
      key: "options",
      get: function get() {
        var options = _Structural.prototype.options;
        options.push(new _option.Option(this, 'column', '<i></i>', 'Add Column', this.addColumn, ['add-column'], 10));
        return options;
      }
    }]);

    return Row;
  }(_abstract);

  return Row;
});
//# sourceMappingURL=row.js.map
