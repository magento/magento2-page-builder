define(["./abstract", "../../config", "../../../utils/array", "./options/option", "knockout"], function (_abstract, _config, _array, _option, _knockout) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return _get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * Column class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var Column =
  /*#__PURE__*/
  function (_Structural) {
    _inherits(Column, _Structural);

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    function Column(parent, stage) {
      var _this;

      _classCallCheck(this, Column);

      _this = _possibleConstructorReturn(this, (Column.__proto__ || Object.getPrototypeOf(Column)).call(this, parent, stage));
      _this.previewTemplate = 'Gene_BlueFoot/component/block/preview/column.html';
      _this.columnDefinition = _knockout.observable(_config.getInitConfig('column_definitions')[0]);
      _this.widthClasses = _knockout.computed(function () {
        return this.columnDefinition()['className'];
      }, _this);
      _this.serializedWidth = _knockout.computed(function () {
        return this.columnDefinition()['breakpoint'] * 100;
      }, _this);

      _this.options.push(new _option.Option(_this, 'column', '<i></i>', 'Add Column', _this.addColumn.bind(_this), ['add-column'], 10));

      return _this;
    }
    /**
     * Add a column to self
     *
     * @param data
     * @returns {Column}
     */


    _createClass(Column, [{
      key: "addColumn",
      value: function addColumn(data) {
        var column = new Column(this, this.stage);
        this.addChild(column);
        column.updateColumnData(data);
        return column;
      }
      /**
       * Insert a column at a specific instance
       *
       * @param direction
       * @param item
       * @param data
       * @returns {Column}
       */

    }, {
      key: "insertColumnAtIndex",
      value: function insertColumnAtIndex(direction, item, data) {
        var index = _knockout.utils.arrayIndexOf(item.parent.children(), item),
            column = new Column(item.parent, item.parent.stage);

        if (direction == 'right') {
          ++index;
        }

        (0, _array.moveArrayItemIntoArray)(column, item.parent.children, index);
        column.updateColumnData(data);
        return column;
      }
      /**
       * Update the column data to reflect the correct width
       *
       * @param data
       */

    }, {
      key: "updateColumnData",
      value: function updateColumnData(data) {
        data = data || {};

        if (data.width) {
          var columnDef = _config.getColumnDefinitionByBreakpoint(data.width);

          if (columnDef) {
            this.columnDefinition(columnDef);
          }
        } else if (data.className) {
          this.columnDefinition(_config.getColumnDefinitionByClassName(data.className));
        }

        this.stage.store.update(this.id, data);
      }
      /**
       * Handle sort starting on column
       *
       * @param event
       * @param params
       * @returns {any}
       */

    }, {
      key: "onSortStart",
      value: function onSortStart(event, params) {
        // Copy over the column class for the width
        jQuery(params.placeholder).addClass(this.widthClasses());
        return _get(Column.prototype.__proto__ || Object.getPrototypeOf(Column.prototype), "onSortStart", this).call(this, event, params);
      }
      /**
       * Get template master format template
       *
       * @returns {string}
       */

    }, {
      key: "getPreviewTemplate",
      value: function getPreviewTemplate() {
        return 'Gene_BlueFoot/component/stage/structural/render/column.html';
      }
    }]);

    return Column;
  }(_abstract);

  return {
    Column: Column
  };
});
//# sourceMappingURL=column.js.map
