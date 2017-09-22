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
      _this.options.push(new _option.Option(_this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy50cyJdLCJuYW1lcyI6WyJSb3ciLCJwYXJlbnQiLCJzdGFnZSIsInRlbXBsYXRlIiwib3B0aW9ucyIsInB1c2giLCJhZGRDb2x1bW4iLCJkYXRhIiwiY29sdW1uIiwiYWRkQ2hpbGQiLCJ1cGRhdGVDb2x1bW5EYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BZWNBLEc7OztBQUdWOzs7Ozs7QUFNQSxpQkFBWUMsTUFBWixFQUEyQ0MsS0FBM0MsRUFBZ0U7QUFBQTs7QUFBQSxtREFDNUQsK0JBQU1ELE1BQU4sRUFBY0MsS0FBZCxDQUQ0RDs7QUFSaEUsWUFBQUMsUUFBQSxHQUFtQixtREFBbkI7QUFXSSxZQUFLQyxPQUFMLENBQWFDLElBQWIsQ0FDSSwwQkFBaUIsUUFBakIsRUFBMkIsVUFBM0IsRUFBdUMsWUFBdkMsRUFBcUQsS0FBckQsRUFBNEQsQ0FBQyxZQUFELENBQTVELEVBQTRFLEVBQTVFLENBREo7QUFINEQ7QUFNL0Q7QUFFRDs7Ozs7Ozs7a0JBTUFDLFMsc0JBQVVDLEksRUFBYTtBQUNuQixVQUFJQyxTQUFTLG1CQUFXLElBQVgsRUFBaUIsS0FBS04sS0FBdEIsQ0FBYjtBQUNBLFdBQUtPLFFBQUwsQ0FBY0QsTUFBZDtBQUNBQSxhQUFPRSxnQkFBUCxDQUF3QkgsSUFBeEI7QUFDQSxhQUFPQyxNQUFQO0FBQ0gsSzs7Ozs7b0JBNUJTUixHIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QnO1xuaW1wb3J0IHsgQ29sdW1uSW50ZXJmYWNlIH0gZnJvbSAnLi9jb2x1bW4uZCc7XG5pbXBvcnQgeyBSb3dJbnRlcmZhY2UgfSBmcm9tIFwiLi9yb3cuZFwiO1xuaW1wb3J0IHsgQ29sdW1uIH0gZnJvbSBcIi4vY29sdW1uXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvblwiO1xuaW1wb3J0IHsgT3B0aW9uSW50ZXJmYWNlIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb24uZFwiO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9zdGFnZS5kJztcbmltcG9ydCBcImtvLXJlc2l6YWJsZVwiO1xuXG4vKipcbiAqIFJvdyBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3cgZXh0ZW5kcyBBYnN0cmFjdFN0cnVjdHVyYWwgaW1wbGVtZW50cyBSb3dJbnRlcmZhY2Uge1xuICAgIHRlbXBsYXRlOiBzdHJpbmcgPSAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9yb3cuaHRtbCc7XG5cbiAgICAvKipcbiAgICAgKiBBYnN0cmFjdCBzdHJ1Y3R1cmFsIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBFZGl0YWJsZUFyZWFJbnRlcmZhY2UsIHN0YWdlOiBTdGFnZUludGVyZmFjZSkge1xuICAgICAgICBzdXBlcihwYXJlbnQsIHN0YWdlKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub3B0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnY29sdW1uJywgJzxpPu6YujwvaT4nLCAnQWRkIENvbHVtbicsIGZhbHNlLCBbJ2FkZC1jb2x1bW4nXSwgMTApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29sdW1uIHRvIHRoZSByb3dcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBhZGRDb2x1bW4oZGF0YT86IG9iamVjdCk6IENvbHVtbkludGVyZmFjZSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBuZXcgQ29sdW1uKHRoaXMsIHRoaXMuc3RhZ2UpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGNvbHVtbik7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cbn0iXX0=
