define(["exports", "./abstract", "./column", "./options/option"], function (exports, _abstract, _column, _option) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Row = undefined;

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

    var Row = exports.Row = function (_AbstractStructural) {
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
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9yb3cudHMiLCJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9yb3cuanMiXSwibmFtZXMiOlsiUm93IiwiYXJndW1lbnRzIiwidGVtcGxhdGUiLCJvcHRpb25zIiwiZGF0YSIsImNvbHVtbiIsInN0YWdlIiwiYWRkQ2hpbGQiLCJ1cGRhdGVDb2x1bW5EYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQVlNQSxHLFdBQUFBLEc7OztBQUFOLHVCQUFBO0FBQUE7O0FBQUEsbUhDRmlCQyxTREVqQjs7QUFDSSxrQkFBQUMsUUFBQSxHQUFtQixtREFBbkI7QUFFQTtBQUNBLGtCQUFBQyxPQUFBLEdBQWtDLENBQzlCLDBCQUFpQixRQUFqQixFQUEyQixVQUEzQixFQUF1QyxZQUF2QyxFQUFxRCxLQUFyRCxFQUE0RCxDQUFDLFlBQUQsQ0FBNUQsRUFBNEUsRUFBNUUsQ0FEOEIsQ0FBbEM7QUFKSjtBQW9CQztBQVpHOzs7Ozs7Ozs7O3NDQU1VQyxJLEVBQWE7QUFDbkIsb0JBQUlDLFNBQVMsbUJBQVcsSUFBWCxFQUFpQixLQUFLQyxLQUF0QixDQUFiO0FBQ0EscUJBQUtDLFFBQUwsQ0FBY0YsTUFBZDtBQUNBQSx1QkFBT0csZ0JBQVAsQ0FBd0JKLElBQXhCO0FBQ0EsdUJBQU9DLE1BQVA7QUFDSCIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9yb3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYnN0cmFjdFN0cnVjdHVyYWwgfSBmcm9tICcuL2Fic3RyYWN0JztcbmltcG9ydCB7IENvbHVtbkludGVyZmFjZSB9IGZyb20gJy4vY29sdW1uLmQnO1xuaW1wb3J0IHsgUm93SW50ZXJmYWNlIH0gZnJvbSBcIi4vcm93LmRcIjtcbmltcG9ydCB7IENvbHVtbiB9IGZyb20gXCIuL2NvbHVtblwiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb25cIjtcbmltcG9ydCB7IE9wdGlvbkludGVyZmFjZSB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uLmRcIjtcblxuLyoqXG4gKiBSb3cgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIFJvdyBleHRlbmRzIEFic3RyYWN0U3RydWN0dXJhbCBpbXBsZW1lbnRzIFJvd0ludGVyZmFjZSB7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5odG1sJztcblxuICAgIC8vIEB0b2RvIGRldGVybWluZSBob3cgdG8gbWVyZ2Ugd2l0aCBzdXBlclxuICAgIG9wdGlvbnM6IEFycmF5PE9wdGlvbkludGVyZmFjZT4gPSBbXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ2NvbHVtbicsICc8aT7umLo8L2k+JywgJ0FkZCBDb2x1bW4nLCBmYWxzZSwgWydhZGQtY29sdW1uJ10sIDEwKSxcbiAgICBdO1xuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29sdW1uIHRvIHRoZSByb3dcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBhZGRDb2x1bW4oZGF0YT86IG9iamVjdCk6IENvbHVtbkludGVyZmFjZSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBuZXcgQ29sdW1uKHRoaXMsIHRoaXMuc3RhZ2UpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGNvbHVtbik7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBYnN0cmFjdFN0cnVjdHVyYWwgfSBmcm9tICcuL2Fic3RyYWN0JztcbmltcG9ydCB7IENvbHVtbiB9IGZyb20gXCIuL2NvbHVtblwiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb25cIjtcbi8qKlxuICogUm93IGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBSb3cgZXh0ZW5kcyBBYnN0cmFjdFN0cnVjdHVyYWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvcm93Lmh0bWwnO1xuICAgICAgICAvLyBAdG9kbyBkZXRlcm1pbmUgaG93IHRvIG1lcmdlIHdpdGggc3VwZXJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gW1xuICAgICAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnY29sdW1uJywgJzxpPu6YujwvaT4nLCAnQWRkIENvbHVtbicsIGZhbHNlLCBbJ2FkZC1jb2x1bW4nXSwgMTApLFxuICAgICAgICBdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb2x1bW4gdG8gdGhlIHJvd1xuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGFkZENvbHVtbihkYXRhKSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBuZXcgQ29sdW1uKHRoaXMsIHRoaXMuc3RhZ2UpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGNvbHVtbik7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cbn1cbiJdfQ==
