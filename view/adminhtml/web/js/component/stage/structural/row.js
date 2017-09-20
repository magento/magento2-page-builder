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

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

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

        function Row() {
            _classCallCheck(this, Row);

            var _this = _possibleConstructorReturn(this, (Row.__proto__ || Object.getPrototypeOf(Row)).apply(this, arguments));

            _this.template = 'Gene_BlueFoot/component/stage/structural/row.html';
            // @todo determine how to merge with super
            _this.options = [new _option.Option(_this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10)];
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
                this.addChild(column);
                column.updateColumnData(data);
                return column;
            }
        }]);

        return Row;
    }(_abstract.AbstractStructural);

    exports.default = Row;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy50cyIsImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5qcyJdLCJuYW1lcyI6WyJSb3ciLCJhcmd1bWVudHMiLCJ0ZW1wbGF0ZSIsIm9wdGlvbnMiLCJkYXRhIiwiY29sdW1uIiwic3RhZ2UiLCJhZGRDaGlsZCIsInVwZGF0ZUNvbHVtbkRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFhY0EsRzs7O0FBQWQsdUJBQUE7QUFBQTs7QUFBQSxtSENGaUJDLFNERWpCOztBQUNJLGtCQUFBQyxRQUFBLEdBQW1CLG1EQUFuQjtBQUVBO0FBQ0Esa0JBQUFDLE9BQUEsR0FBa0MsQ0FDOUIsMEJBQWlCLFFBQWpCLEVBQTJCLFVBQTNCLEVBQXVDLFlBQXZDLEVBQXFELEtBQXJELEVBQTRELENBQUMsWUFBRCxDQUE1RCxFQUE0RSxFQUE1RSxDQUQ4QixDQUFsQztBQUpKO0FBb0JDO0FBWkc7Ozs7Ozs7Ozs7c0NBTVVDLEksRUFBYTtBQUNuQixvQkFBSUMsU0FBUyxtQkFBVyxJQUFYLEVBQWlCLEtBQUtDLEtBQXRCLENBQWI7QUFDQSxxQkFBS0MsUUFBTCxDQUFjRixNQUFkO0FBQ0FBLHVCQUFPRyxnQkFBUCxDQUF3QkosSUFBeEI7QUFDQSx1QkFBT0MsTUFBUDtBQUNIOzs7Ozs7c0JBbkJTTCxHIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QnO1xuaW1wb3J0IHsgQ29sdW1uSW50ZXJmYWNlIH0gZnJvbSAnLi9jb2x1bW4uZCc7XG5pbXBvcnQgeyBSb3dJbnRlcmZhY2UgfSBmcm9tIFwiLi9yb3cuZFwiO1xuaW1wb3J0IHsgQ29sdW1uIH0gZnJvbSBcIi4vY29sdW1uXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvblwiO1xuaW1wb3J0IHsgT3B0aW9uSW50ZXJmYWNlIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb24uZFwiO1xuaW1wb3J0IFwia28tcmVzaXphYmxlXCI7XG5cbi8qKlxuICogUm93IGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvdyBleHRlbmRzIEFic3RyYWN0U3RydWN0dXJhbCBpbXBsZW1lbnRzIFJvd0ludGVyZmFjZSB7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5odG1sJztcblxuICAgIC8vIEB0b2RvIGRldGVybWluZSBob3cgdG8gbWVyZ2Ugd2l0aCBzdXBlclxuICAgIG9wdGlvbnM6IEFycmF5PE9wdGlvbkludGVyZmFjZT4gPSBbXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ2NvbHVtbicsICc8aT7umLo8L2k+JywgJ0FkZCBDb2x1bW4nLCBmYWxzZSwgWydhZGQtY29sdW1uJ10sIDEwKSxcbiAgICBdO1xuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29sdW1uIHRvIHRoZSByb3dcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBhZGRDb2x1bW4oZGF0YT86IG9iamVjdCk6IENvbHVtbkludGVyZmFjZSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBuZXcgQ29sdW1uKHRoaXMsIHRoaXMuc3RhZ2UpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGNvbHVtbik7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBYnN0cmFjdFN0cnVjdHVyYWwgfSBmcm9tICcuL2Fic3RyYWN0JztcbmltcG9ydCB7IENvbHVtbiB9IGZyb20gXCIuL2NvbHVtblwiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb25cIjtcbmltcG9ydCBcImtvLXJlc2l6YWJsZVwiO1xuLyoqXG4gKiBSb3cgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm93IGV4dGVuZHMgQWJzdHJhY3RTdHJ1Y3R1cmFsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5odG1sJztcbiAgICAgICAgLy8gQHRvZG8gZGV0ZXJtaW5lIGhvdyB0byBtZXJnZSB3aXRoIHN1cGVyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IFtcbiAgICAgICAgICAgIG5ldyBPcHRpb24odGhpcywgJ2NvbHVtbicsICc8aT7umLo8L2k+JywgJ0FkZCBDb2x1bW4nLCBmYWxzZSwgWydhZGQtY29sdW1uJ10sIDEwKSxcbiAgICAgICAgXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkIGEgY29sdW1uIHRvIHRoZSByb3dcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBhZGRDb2x1bW4oZGF0YSkge1xuICAgICAgICBsZXQgY29sdW1uID0gbmV3IENvbHVtbih0aGlzLCB0aGlzLnN0YWdlKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChjb2x1bW4pO1xuICAgICAgICBjb2x1bW4udXBkYXRlQ29sdW1uRGF0YShkYXRhKTtcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9XG59XG4iXX0=
