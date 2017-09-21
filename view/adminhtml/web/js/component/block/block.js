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

      var _this = _possibleConstructorReturn(this, _AbstractStructural.call(this, parent, stage));

      _this.editOnInsert = true;
      _this.childEntityKeys = [];
      return _this;
    }

    return Block;
  }(_abstract.AbstractStructural);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9ibG9jay50cyJdLCJuYW1lcyI6WyJCbG9jayIsInBhcmVudCIsInN0YWdlIiwiY29uZmlnIiwiZm9ybURhdGEiLCJlZGl0T25JbnNlcnQiLCJjaGlsZEVudGl0eUtleXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BVU1BLEssV0FBQUEsSzs7O0FBT0Y7Ozs7Ozs7O0FBUUEsbUJBQVlDLE1BQVosRUFBMkNDLEtBQTNDLEVBQWtFQyxNQUFsRSxFQUErRUMsUUFBL0UsRUFBNEY7QUFBQTs7QUFBQSxtREFDeEYsK0JBQU1ILE1BQU4sRUFBY0MsS0FBZCxDQUR3Rjs7QUFaNUYsWUFBQUcsWUFBQSxHQUF3QixJQUF4QjtBQUVBLFlBQUFDLGVBQUEsR0FBaUMsRUFBakM7QUFVNEY7QUFFM0YiLCJmaWxlIjoiY29tcG9uZW50L2Jsb2NrL2Jsb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWJzdHJhY3RTdHJ1Y3R1cmFsIH0gZnJvbSAnLi4vc3RhZ2Uvc3RydWN0dXJhbC9hYnN0cmFjdCc7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuLi9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEuZCdcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vc3RhZ2UuZCc7XG5pbXBvcnQgeyBCbG9jayBhcyBCbG9ja0ludGVyZmFjZSB9IGZyb20gJy4vYmxvY2suZCc7XG5cbi8qKlxuICogQWJzdHJhY3RCbG9jayBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgQmxvY2sgZXh0ZW5kcyBBYnN0cmFjdFN0cnVjdHVyYWwgaW1wbGVtZW50cyBCbG9ja0ludGVyZmFjZSB7XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICBjb25maWc6IG9iamVjdDtcbiAgICBlZGl0T25JbnNlcnQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHByZXZpZXc6IGFueTsgLy8gQHRvZG9cbiAgICBjaGlsZEVudGl0eUtleXM6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEFic3RyYWN0QmxvY2sgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKiBAcGFyYW0gY29uZmlnXG4gICAgICogQHBhcmFtIGZvcm1EYXRhXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBFZGl0YWJsZUFyZWFJbnRlcmZhY2UsIHN0YWdlOiBTdGFnZUludGVyZmFjZSwgY29uZmlnOiBhbnksIGZvcm1EYXRhOiBhbnkpIHtcbiAgICAgICAgc3VwZXIocGFyZW50LCBzdGFnZSk7XG4gICAgfVxufSJdfQ==
