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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy50cyIsImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5qcyJdLCJuYW1lcyI6WyJSb3ciLCJhcmd1bWVudHMiLCJ0ZW1wbGF0ZSIsIm9wdGlvbnMiLCJkYXRhIiwiY29sdW1uIiwic3RhZ2UiLCJhZGRDaGlsZCIsInVwZGF0ZUNvbHVtbkRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBWU1BLEcsV0FBQUEsRzs7O0FBQU4sdUJBQUE7QUFBQTs7QUFBQSxtSENGaUJDLFNERWpCOztBQUNJLGtCQUFBQyxRQUFBLEdBQW1CLG1EQUFuQjtBQUVBO0FBQ0Esa0JBQUFDLE9BQUEsR0FBa0MsQ0FDOUIsMEJBQWlCLFFBQWpCLEVBQTJCLFVBQTNCLEVBQXVDLFlBQXZDLEVBQXFELEtBQXJELEVBQTRELENBQUMsWUFBRCxDQUE1RCxFQUE0RSxFQUE1RSxDQUQ4QixDQUFsQztBQUpKO0FBb0JDO0FBWkc7Ozs7Ozs7Ozs7c0NBTVVDLEksRUFBYTtBQUNuQixvQkFBSUMsU0FBUyxtQkFBVyxJQUFYLEVBQWlCLEtBQUtDLEtBQXRCLENBQWI7QUFDQSxxQkFBS0MsUUFBTCxDQUFjRixNQUFkO0FBQ0FBLHVCQUFPRyxnQkFBUCxDQUF3QkosSUFBeEI7QUFDQSx1QkFBT0MsTUFBUDtBQUNIIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QnO1xuaW1wb3J0IHsgQ29sdW1uSW50ZXJmYWNlIH0gZnJvbSAnLi9jb2x1bW4uZCc7XG5pbXBvcnQgeyBSb3dJbnRlcmZhY2UgfSBmcm9tIFwiLi9yb3cuZFwiO1xuaW1wb3J0IHsgQ29sdW1uIH0gZnJvbSBcIi4vY29sdW1uXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvblwiO1xuaW1wb3J0IHsgT3B0aW9uSW50ZXJmYWNlIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb24uZFwiO1xuXG4vKipcbiAqIFJvdyBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgUm93IGV4dGVuZHMgQWJzdHJhY3RTdHJ1Y3R1cmFsIGltcGxlbWVudHMgUm93SW50ZXJmYWNlIHtcbiAgICB0ZW1wbGF0ZTogc3RyaW5nID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvcm93Lmh0bWwnO1xuXG4gICAgLy8gQHRvZG8gZGV0ZXJtaW5lIGhvdyB0byBtZXJnZSB3aXRoIHN1cGVyXG4gICAgb3B0aW9uczogQXJyYXk8T3B0aW9uSW50ZXJmYWNlPiA9IFtcbiAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnY29sdW1uJywgJzxpPu6YujwvaT4nLCAnQWRkIENvbHVtbicsIGZhbHNlLCBbJ2FkZC1jb2x1bW4nXSwgMTApLFxuICAgIF07XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb2x1bW4gdG8gdGhlIHJvd1xuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGFkZENvbHVtbihkYXRhPzogb2JqZWN0KTogQ29sdW1uSW50ZXJmYWNlIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IG5ldyBDb2x1bW4odGhpcywgdGhpcy5zdGFnZSk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoY29sdW1uKTtcbiAgICAgICAgY29sdW1uLnVwZGF0ZUNvbHVtbkRhdGEoZGF0YSk7XG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfVxufSIsImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QnO1xuaW1wb3J0IHsgQ29sdW1uIH0gZnJvbSBcIi4vY29sdW1uXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvblwiO1xuLyoqXG4gKiBSb3cgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIFJvdyBleHRlbmRzIEFic3RyYWN0U3RydWN0dXJhbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9yb3cuaHRtbCc7XG4gICAgICAgIC8vIEB0b2RvIGRldGVybWluZSBob3cgdG8gbWVyZ2Ugd2l0aCBzdXBlclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBbXG4gICAgICAgICAgICBuZXcgT3B0aW9uKHRoaXMsICdjb2x1bW4nLCAnPGk+7pi6PC9pPicsICdBZGQgQ29sdW1uJywgZmFsc2UsIFsnYWRkLWNvbHVtbiddLCAxMCksXG4gICAgICAgIF07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbHVtbiB0byB0aGUgcm93XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgYWRkQ29sdW1uKGRhdGEpIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IG5ldyBDb2x1bW4odGhpcywgdGhpcy5zdGFnZSk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoY29sdW1uKTtcbiAgICAgICAgY29sdW1uLnVwZGF0ZUNvbHVtbkRhdGEoZGF0YSk7XG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfVxufVxuIl19
