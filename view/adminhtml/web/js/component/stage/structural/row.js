define(["exports", "./abstract", "./column", "./options/option"], function (exports, _abstract, _column, _option) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy50cyIsImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5qcyJdLCJuYW1lcyI6WyJSb3ciLCJhcmd1bWVudHMiLCJ0ZW1wbGF0ZSIsIm9wdGlvbnMiLCJkYXRhIiwiY29sdW1uIiwic3RhZ2UiLCJhZGRDaGlsZCIsInVwZGF0ZUNvbHVtbkRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFZY0EsRzs7O0FBQWQsdUJBQUE7QUFBQTs7QUFBQSxtSENGaUJDLFNERWpCOztBQUNJLGtCQUFBQyxRQUFBLEdBQW1CLG1EQUFuQjtBQUVBO0FBQ0Esa0JBQUFDLE9BQUEsR0FBa0MsQ0FDOUIsMEJBQWlCLFFBQWpCLEVBQTJCLFVBQTNCLEVBQXVDLFlBQXZDLEVBQXFELEtBQXJELEVBQTRELENBQUMsWUFBRCxDQUE1RCxFQUE0RSxFQUE1RSxDQUQ4QixDQUFsQztBQUpKO0FBb0JDO0FBWkc7Ozs7Ozs7Ozs7c0NBTVVDLEksRUFBYTtBQUNuQixvQkFBSUMsU0FBUyxtQkFBVyxJQUFYLEVBQWlCLEtBQUtDLEtBQXRCLENBQWI7QUFDQSxxQkFBS0MsUUFBTCxDQUFjRixNQUFkO0FBQ0FBLHVCQUFPRyxnQkFBUCxDQUF3QkosSUFBeEI7QUFDQSx1QkFBT0MsTUFBUDtBQUNIOzs7Ozs7c0JBbkJTTCxHIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QnO1xuaW1wb3J0IHsgQ29sdW1uSW50ZXJmYWNlIH0gZnJvbSAnLi9jb2x1bW4uZCc7XG5pbXBvcnQgeyBSb3dJbnRlcmZhY2UgfSBmcm9tIFwiLi9yb3cuZFwiO1xuaW1wb3J0IHsgQ29sdW1uIH0gZnJvbSBcIi4vY29sdW1uXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvblwiO1xuaW1wb3J0IHsgT3B0aW9uSW50ZXJmYWNlIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb24uZFwiO1xuXG4vKipcbiAqIFJvdyBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3cgZXh0ZW5kcyBBYnN0cmFjdFN0cnVjdHVyYWwgaW1wbGVtZW50cyBSb3dJbnRlcmZhY2Uge1xuICAgIHRlbXBsYXRlOiBzdHJpbmcgPSAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9yb3cuaHRtbCc7XG5cbiAgICAvLyBAdG9kbyBkZXRlcm1pbmUgaG93IHRvIG1lcmdlIHdpdGggc3VwZXJcbiAgICBvcHRpb25zOiBBcnJheTxPcHRpb25JbnRlcmZhY2U+ID0gW1xuICAgICAgICBuZXcgT3B0aW9uKHRoaXMsICdjb2x1bW4nLCAnPGk+7pi6PC9pPicsICdBZGQgQ29sdW1uJywgZmFsc2UsIFsnYWRkLWNvbHVtbiddLCAxMCksXG4gICAgXTtcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbHVtbiB0byB0aGUgcm93XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgYWRkQ29sdW1uKGRhdGE/OiBvYmplY3QpOiBDb2x1bW5JbnRlcmZhY2Uge1xuICAgICAgICBsZXQgY29sdW1uID0gbmV3IENvbHVtbih0aGlzLCB0aGlzLnN0YWdlKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChjb2x1bW4pO1xuICAgICAgICBjb2x1bW4udXBkYXRlQ29sdW1uRGF0YShkYXRhKTtcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9XG59IiwiaW1wb3J0IHsgQWJzdHJhY3RTdHJ1Y3R1cmFsIH0gZnJvbSAnLi9hYnN0cmFjdCc7XG5pbXBvcnQgeyBDb2x1bW4gfSBmcm9tIFwiLi9jb2x1bW5cIjtcbmltcG9ydCB7IE9wdGlvbiB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uXCI7XG4vKipcbiAqIFJvdyBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3cgZXh0ZW5kcyBBYnN0cmFjdFN0cnVjdHVyYWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvcm93Lmh0bWwnO1xuICAgICAgICAvLyBAdG9kbyBkZXRlcm1pbmUgaG93IHRvIG1lcmdlIHdpdGggc3VwZXJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gW1xuICAgICAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnY29sdW1uJywgJzxpPu6YujwvaT4nLCAnQWRkIENvbHVtbicsIGZhbHNlLCBbJ2FkZC1jb2x1bW4nXSwgMTApLFxuICAgICAgICBdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb2x1bW4gdG8gdGhlIHJvd1xuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGFkZENvbHVtbihkYXRhKSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBuZXcgQ29sdW1uKHRoaXMsIHRoaXMuc3RhZ2UpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGNvbHVtbik7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cbn1cbiJdfQ==
