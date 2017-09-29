define(['exports', 'knockout', '../../../config'], function (exports, _knockout, _config) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ColumnBuilder = undefined;

    var _knockout2 = _interopRequireDefault(_knockout);

    var _config2 = _interopRequireDefault(_config);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ColumnBuilder = exports.ColumnBuilder = function () {
        /**
         * ColumnBuilder constructor
         */
        function ColumnBuilder() {
            _classCallCheck(this, ColumnBuilder);

            this.position = _knockout2.default.observable('');
            this.visible = _knockout2.default.observable(false);
            this.sizes = _knockout2.default.observableArray([]);
            this.template = 'Gene_BlueFoot/component/stage/structural/column/builder.html';
            var columnOptions = _config2.default.getInitConfig("column_definitions");
            for (var i = 0; i < columnOptions.length; i++) {
                if (columnOptions[i].displayed === true) {
                    this.sizes.push({
                        label: columnOptions[i].label,
                        className: columnOptions[i].className
                    });
                }
            }
        }
        /**
         * Show the builder from the column options scope
         */


        ColumnBuilder.prototype.showFromOption = function showFromOption() {
            this.position('top');
            this.visible(true);
        };

        /**
         * Change the visibility to visible
         */
        ColumnBuilder.prototype.show = function show() {
            this.visible(true);
        };

        /**
         * Change the visibility to hidden
         */
        ColumnBuilder.prototype.hide = function hide() {
            this.visible(false);
        };

        /**
         * Proxy to the correct parent's add column function
         */
        ColumnBuilder.prototype.addColumn = function addColumn(parents, data) {
            // Nest a column (within a column or on a row)
            if (this.position() == 'top') {
                parents[1].addColumn(data);
            } else {
                // Add to left or right side of current column
                parents[1].insertColumnAtIndex(this.position(), parents[1], data);
            }
        };

        return ColumnBuilder;
    }();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi9idWlsZGVyLnRzIl0sIm5hbWVzIjpbIkNvbHVtbkJ1aWxkZXIiLCJwb3NpdGlvbiIsIm9ic2VydmFibGUiLCJ2aXNpYmxlIiwic2l6ZXMiLCJvYnNlcnZhYmxlQXJyYXkiLCJ0ZW1wbGF0ZSIsImNvbHVtbk9wdGlvbnMiLCJnZXRJbml0Q29uZmlnIiwiaSIsImxlbmd0aCIsImRpc3BsYXllZCIsInB1c2giLCJsYWJlbCIsImNsYXNzTmFtZSIsInNob3dGcm9tT3B0aW9uIiwic2hvdyIsImhpZGUiLCJhZGRDb2x1bW4iLCJwYXJlbnRzIiwiZGF0YSIsImluc2VydENvbHVtbkF0SW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU1NQSxhLFdBQUFBLGE7QUFNRjs7O0FBR0EsaUNBQUE7QUFBQTs7QUFSQSxpQkFBQUMsUUFBQSxHQUF1QyxtQkFBR0MsVUFBSCxDQUFjLEVBQWQsQ0FBdkM7QUFDQSxpQkFBQUMsT0FBQSxHQUF1QyxtQkFBR0QsVUFBSCxDQUFjLEtBQWQsQ0FBdkM7QUFDQSxpQkFBQUUsS0FBQSxHQUF5QyxtQkFBR0MsZUFBSCxDQUFtQixFQUFuQixDQUF6QztBQUNBLGlCQUFBQyxRQUFBLEdBQW1CLDhEQUFuQjtBQU1JLGdCQUFNQyxnQkFBZ0IsaUJBQU9DLGFBQVAsQ0FBcUIsb0JBQXJCLENBQXRCO0FBRUEsaUJBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixjQUFjRyxNQUFsQyxFQUEwQ0QsR0FBMUMsRUFBK0M7QUFDM0Msb0JBQUlGLGNBQWNFLENBQWQsRUFBaUJFLFNBQWpCLEtBQStCLElBQW5DLEVBQXlDO0FBQ3JDLHlCQUFLUCxLQUFMLENBQVdRLElBQVgsQ0FBZ0I7QUFDWkMsK0JBQU9OLGNBQWNFLENBQWQsRUFBaUJJLEtBRFo7QUFFWkMsbUNBQVdQLGNBQWNFLENBQWQsRUFBaUJLO0FBRmhCLHFCQUFoQjtBQUlIO0FBQ0o7QUFDSjtBQUVEOzs7OztnQ0FHQUMsYyw2QkFBYztBQUNWLGlCQUFLZCxRQUFMLENBQWMsS0FBZDtBQUNBLGlCQUFLRSxPQUFMLENBQWEsSUFBYjtBQUNILFM7O0FBRUQ7OztnQ0FHQWEsSSxtQkFBSTtBQUNBLGlCQUFLYixPQUFMLENBQWEsSUFBYjtBQUNILFM7O0FBRUQ7OztnQ0FHQWMsSSxtQkFBSTtBQUNBLGlCQUFLZCxPQUFMLENBQWEsS0FBYjtBQUNILFM7O0FBRUQ7OztnQ0FHQWUsUyxzQkFBVUMsTyxFQUFjQyxJLEVBQVM7QUFDN0I7QUFDQSxnQkFBSSxLQUFLbkIsUUFBTCxNQUFtQixLQUF2QixFQUE4QjtBQUMxQmtCLHdCQUFRLENBQVIsRUFBV0QsU0FBWCxDQUFxQkUsSUFBckI7QUFDSCxhQUZELE1BRU87QUFDSDtBQUNBRCx3QkFBUSxDQUFSLEVBQVdFLG1CQUFYLENBQStCLEtBQUtwQixRQUFMLEVBQS9CLEVBQWdEa0IsUUFBUSxDQUFSLENBQWhELEVBQTREQyxJQUE1RDtBQUNIO0FBQ0osUyIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jb2x1bW4vYnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBrbyBmcm9tICdrbm9ja291dCc7XG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuLi8uLi8uLi9jb25maWdcIjtcblxuLyoqXG4gKiBDb2x1bW5CdWlsZGVyIENsYXNzXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2x1bW5CdWlsZGVyIHtcbiAgICBwb3NpdGlvbjogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gPSBrby5vYnNlcnZhYmxlKCcnKTtcbiAgICB2aXNpYmxlOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj4gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICBzaXplczogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8b2JqZWN0PiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi9idWlsZGVyLmh0bWwnO1xuXG4gICAgLyoqXG4gICAgICogQ29sdW1uQnVpbGRlciBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zdCBjb2x1bW5PcHRpb25zID0gQ29uZmlnLmdldEluaXRDb25maWcoXCJjb2x1bW5fZGVmaW5pdGlvbnNcIik7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbk9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjb2x1bW5PcHRpb25zW2ldLmRpc3BsYXllZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBjb2x1bW5PcHRpb25zW2ldLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNvbHVtbk9wdGlvbnNbaV0uY2xhc3NOYW1lXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBidWlsZGVyIGZyb20gdGhlIGNvbHVtbiBvcHRpb25zIHNjb3BlXG4gICAgICovXG4gICAgc2hvd0Zyb21PcHRpb24oKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24oJ3RvcCcpO1xuICAgICAgICB0aGlzLnZpc2libGUodHJ1ZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgdmlzaWJpbGl0eSB0byB2aXNpYmxlXG4gICAgICovXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlKHRydWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIHZpc2liaWxpdHkgdG8gaGlkZGVuXG4gICAgICovXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUHJveHkgdG8gdGhlIGNvcnJlY3QgcGFyZW50J3MgYWRkIGNvbHVtbiBmdW5jdGlvblxuICAgICAqL1xuICAgIGFkZENvbHVtbihwYXJlbnRzOiBhbnksIGRhdGE6IGFueSkge1xuICAgICAgICAvLyBOZXN0IGEgY29sdW1uICh3aXRoaW4gYSBjb2x1bW4gb3Igb24gYSByb3cpXG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uKCkgPT0gJ3RvcCcpIHtcbiAgICAgICAgICAgIHBhcmVudHNbMV0uYWRkQ29sdW1uKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWRkIHRvIGxlZnQgb3IgcmlnaHQgc2lkZSBvZiBjdXJyZW50IGNvbHVtblxuICAgICAgICAgICAgcGFyZW50c1sxXS5pbnNlcnRDb2x1bW5BdEluZGV4KHRoaXMucG9zaXRpb24oKSwgcGFyZW50c1sxXSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xufSJdfQ==
