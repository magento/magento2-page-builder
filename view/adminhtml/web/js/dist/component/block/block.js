define(['exports', '../stage/structural/abstract'], function (exports, _abstract) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Block = undefined;

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

  var Block = exports.Block = function (_AbstractStructural) {
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

      var _this = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, parent, stage));

      _this.editOnInsert = true;
      _this.childEntityKeys = [];
      return _this;
    }

    return Block;
  }(_abstract.AbstractStructural);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvYmxvY2svYmxvY2sudHMiXSwibmFtZXMiOlsiQmxvY2siLCJwYXJlbnQiLCJzdGFnZSIsImNvbmZpZyIsImZvcm1EYXRhIiwiZWRpdE9uSW5zZXJ0IiwiY2hpbGRFbnRpdHlLZXlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVVNQSxLLFdBQUFBLEs7OztBQU9GOzs7Ozs7OztBQVFBLG1CQUFZQyxNQUFaLEVBQTJDQyxLQUEzQyxFQUFrRUMsTUFBbEUsRUFBK0VDLFFBQS9FLEVBQTRGO0FBQUE7O0FBQUEsZ0hBQ2xGSCxNQURrRixFQUMxRUMsS0FEMEU7O0FBWjVGLFlBQUFHLFlBQUEsR0FBd0IsSUFBeEI7QUFFQSxZQUFBQyxlQUFBLEdBQWlDLEVBQWpDO0FBVTRGO0FBRTNGIiwiZmlsZSI6ImNvbXBvbmVudC9ibG9jay9ibG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4uL3N0YWdlL3N0cnVjdHVyYWwvYWJzdHJhY3QnO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi4vc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhLmQnXG5pbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4uL3N0YWdlLmQnO1xuaW1wb3J0IHsgQmxvY2sgYXMgQmxvY2tJbnRlcmZhY2UgfSBmcm9tICcuL2Jsb2NrLmQnO1xuXG4vKipcbiAqIEFic3RyYWN0QmxvY2sgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIEJsb2NrIGV4dGVuZHMgQWJzdHJhY3RTdHJ1Y3R1cmFsIGltcGxlbWVudHMgQmxvY2tJbnRlcmZhY2Uge1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgY29uZmlnOiBvYmplY3Q7XG4gICAgZWRpdE9uSW5zZXJ0OiBib29sZWFuID0gdHJ1ZTtcbiAgICBwcmV2aWV3OiBhbnk7IC8vIEB0b2RvXG4gICAgY2hpbGRFbnRpdHlLZXlzOiBBcnJheTxzdHJpbmc+ID0gW107XG5cbiAgICAvKipcbiAgICAgKiBBYnN0cmFjdEJsb2NrIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqIEBwYXJhbSBmb3JtRGF0YVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UsIGNvbmZpZzogYW55LCBmb3JtRGF0YTogYW55KSB7XG4gICAgICAgIHN1cGVyKHBhcmVudCwgc3RhZ2UpO1xuICAgIH1cbn0iXX0=
