define(["exports", "./abstract", "./column", "./options/option", "ko-resizable"], function (exports, _abstract, _column, _option) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _abstract2 = _interopRequireDefault(_abstract);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Row = function (_Structural) {
    _inherits(Row, _Structural);

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    function Row(parent, stage) {
      _classCallCheck(this, Row);

      var _this = _possibleConstructorReturn(this, _Structural.call(this, parent, stage));

      _this.previewTemplate = 'Gene_BlueFoot/component/block/preview/row.html';
      _this.renderTemplate = 'Gene_BlueFoot/component/block/render/row.html';
      _this.options.push(new _option.Option(_this, 'column', '<i></i>', 'Add Column', _this.addColumn.bind(_this), ['add-column'], 10));
      _this.config.name = 'row';
      return _this;
    }
    /**
     * Add a column to the row
     *
     * @param data
     * @returns {any}
     */


    Row.prototype.addColumn = function addColumn(data) {
      var column = new _column.Column(this, this.stage);
      column = this.onBlockDropped();
      this.addChild(column);
      column.updateColumnData(data);
      return column;
    };

    return Row;
  }(_abstract2.default);

  exports.default = Row;
});