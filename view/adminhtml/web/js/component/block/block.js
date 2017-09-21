define(['exports', '../stage/structural/abstract'], function (exports, _abstract) {
  'use strict';

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

  var Block = function (_AbstractStructural) {
    _inherits(Block, _AbstractStructural);

    /**
     * AbstractBlock constructor
     *
     * @param parent
     * @param stage
     * @param config
     * @param formData
     */
    function Block(parent, stage, config, formData) {
      _classCallCheck(this, Block);

      var _this = _possibleConstructorReturn(this, _AbstractStructural.call(this, parent, stage));

      _this.editOnInsert = true;
      _this.childEntityKeys = [];
      return _this;
    }

    return Block;
  }(_abstract.AbstractStructural);

  exports.default = Block;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9ibG9jay50cyJdLCJuYW1lcyI6WyJCbG9jayIsInBhcmVudCIsInN0YWdlIiwiY29uZmlnIiwiZm9ybURhdGEiLCJlZGl0T25JbnNlcnQiLCJjaGlsZEVudGl0eUtleXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFVY0EsSzs7O0FBT1Y7Ozs7Ozs7O0FBUUEsbUJBQVlDLE1BQVosRUFBMkNDLEtBQTNDLEVBQWtFQyxNQUFsRSxFQUErRUMsUUFBL0UsRUFBNEY7QUFBQTs7QUFBQSxtREFDeEYsK0JBQU1ILE1BQU4sRUFBY0MsS0FBZCxDQUR3Rjs7QUFaNUYsWUFBQUcsWUFBQSxHQUF3QixJQUF4QjtBQUVBLFlBQUFDLGVBQUEsR0FBaUMsRUFBakM7QUFVNEY7QUFFM0Y7Ozs7O29CQWpCU04sSyIsImZpbGUiOiJjb21wb25lbnQvYmxvY2svYmxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYnN0cmFjdFN0cnVjdHVyYWwgfSBmcm9tICcuLi9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0JztcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4uL3N0YWdlL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYS5kJ1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi9zdGFnZS5kJztcbmltcG9ydCB7IEJsb2NrIGFzIEJsb2NrSW50ZXJmYWNlIH0gZnJvbSAnLi9ibG9jay5kJztcblxuLyoqXG4gKiBBYnN0cmFjdEJsb2NrIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJsb2NrIGV4dGVuZHMgQWJzdHJhY3RTdHJ1Y3R1cmFsIGltcGxlbWVudHMgQmxvY2tJbnRlcmZhY2Uge1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgY29uZmlnOiBvYmplY3Q7XG4gICAgZWRpdE9uSW5zZXJ0OiBib29sZWFuID0gdHJ1ZTtcbiAgICBwcmV2aWV3OiBhbnk7IC8vIEB0b2RvXG4gICAgY2hpbGRFbnRpdHlLZXlzOiBBcnJheTxzdHJpbmc+ID0gW107XG5cbiAgICAvKipcbiAgICAgKiBBYnN0cmFjdEJsb2NrIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqIEBwYXJhbSBmb3JtRGF0YVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UsIGNvbmZpZzogYW55LCBmb3JtRGF0YTogYW55KSB7XG4gICAgICAgIHN1cGVyKHBhcmVudCwgc3RhZ2UpO1xuICAgIH1cbn0iXX0=
