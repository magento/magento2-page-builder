define(["exports", "./abstract", "./column", "./options/option", "ko-resizable"], function (exports, _abstract, _column, _option) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var Row = function (_AbstractStructural) {
    _inherits(Row, _AbstractStructural);

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    function Row(parent, stage) {
      _classCallCheck(this, Row);

      var _this = _possibleConstructorReturn(this, _AbstractStructural.call(this, parent, stage));

      _this.template = 'Gene_BlueFoot/component/stage/structural/row.html';
      _this.options.push(new _option.Option(_this, 'column', '<i></i>', 'Add Column', _this.addColumn.bind(_this), ['add-column'], 10));
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
      this.addChild(column);
      column.updateColumnData(data);
      return column;
    };

    return Row;
  }(_abstract.AbstractStructural);

  exports.default = Row;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy50cyJdLCJuYW1lcyI6WyJSb3ciLCJwYXJlbnQiLCJzdGFnZSIsInRlbXBsYXRlIiwib3B0aW9ucyIsInB1c2giLCJhZGRDb2x1bW4iLCJiaW5kIiwiZGF0YSIsImNvbHVtbiIsImFkZENoaWxkIiwidXBkYXRlQ29sdW1uRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWVjQSxHOzs7QUFHVjs7Ozs7O0FBTUEsaUJBQVlDLE1BQVosRUFBMkNDLEtBQTNDLEVBQWdFO0FBQUE7O0FBQUEsbURBQzVELCtCQUFNRCxNQUFOLEVBQWNDLEtBQWQsQ0FENEQ7O0FBUmhFLFlBQUFDLFFBQUEsR0FBbUIsbURBQW5CO0FBV0ksWUFBS0MsT0FBTCxDQUFhQyxJQUFiLENBQ0ksMEJBQWlCLFFBQWpCLEVBQTJCLFVBQTNCLEVBQXVDLFlBQXZDLEVBQXFELE1BQUtDLFNBQUwsQ0FBZUMsSUFBZixPQUFyRCxFQUFnRixDQUFDLFlBQUQsQ0FBaEYsRUFBZ0csRUFBaEcsQ0FESjtBQUg0RDtBQU0vRDtBQUVEOzs7Ozs7OztrQkFNQUQsUyxzQkFBVUUsSSxFQUFhO0FBQ25CLFVBQUlDLFNBQVMsbUJBQVcsSUFBWCxFQUFpQixLQUFLUCxLQUF0QixDQUFiO0FBQ0EsV0FBS1EsUUFBTCxDQUFjRCxNQUFkO0FBQ0FBLGFBQU9FLGdCQUFQLENBQXdCSCxJQUF4QjtBQUNBLGFBQU9DLE1BQVA7QUFDSCxLOzs7OztvQkE1QlNULEciLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvcm93LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWJzdHJhY3RTdHJ1Y3R1cmFsIH0gZnJvbSAnLi9hYnN0cmFjdCc7XG5pbXBvcnQgeyBDb2x1bW5JbnRlcmZhY2UgfSBmcm9tICcuL2NvbHVtbi5kJztcbmltcG9ydCB7IFJvd0ludGVyZmFjZSB9IGZyb20gXCIuL3Jvdy5kXCI7XG5pbXBvcnQgeyBDb2x1bW4gfSBmcm9tIFwiLi9jb2x1bW5cIjtcbmltcG9ydCB7IE9wdGlvbiB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uXCI7XG5pbXBvcnQgeyBPcHRpb25JbnRlcmZhY2UgfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvbi5kXCI7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuL2VkaXRhYmxlLWFyZWEuZCc7XG5pbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4uLy4uL3N0YWdlLmQnO1xuaW1wb3J0IFwia28tcmVzaXphYmxlXCI7XG5cbi8qKlxuICogUm93IGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvdyBleHRlbmRzIEFic3RyYWN0U3RydWN0dXJhbCBpbXBsZW1lbnRzIFJvd0ludGVyZmFjZSB7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5odG1sJztcblxuICAgIC8qKlxuICAgICAqIEFic3RyYWN0IHN0cnVjdHVyYWwgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IEVkaXRhYmxlQXJlYUludGVyZmFjZSwgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlKSB7XG4gICAgICAgIHN1cGVyKHBhcmVudCwgc3RhZ2UpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5vcHRpb25zLnB1c2goXG4gICAgICAgICAgICBuZXcgT3B0aW9uKHRoaXMsICdjb2x1bW4nLCAnPGk+7pi6PC9pPicsICdBZGQgQ29sdW1uJywgdGhpcy5hZGRDb2x1bW4uYmluZCh0aGlzKSwgWydhZGQtY29sdW1uJ10sIDEwKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbHVtbiB0byB0aGUgcm93XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgYWRkQ29sdW1uKGRhdGE/OiBvYmplY3QpOiBDb2x1bW5JbnRlcmZhY2Uge1xuICAgICAgICBsZXQgY29sdW1uID0gbmV3IENvbHVtbih0aGlzLCB0aGlzLnN0YWdlKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChjb2x1bW4pO1xuICAgICAgICBjb2x1bW4udXBkYXRlQ29sdW1uRGF0YShkYXRhKTtcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9XG59Il19
