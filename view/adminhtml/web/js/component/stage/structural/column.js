define(["exports", "./abstract", "../../config", "../../../utils/array", "./options/option"], function (exports, _abstract, _config, _array, _option) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Column = undefined;

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

    var Column = exports.Column = function (_AbstractStructural) {
        _inherits(Column, _AbstractStructural);

        /**
         * Abstract structural constructor
         *
         * @param parent
         * @param stage
         */
        function Column(parent, stage) {
            _classCallCheck(this, Column);

            var _this = _possibleConstructorReturn(this, _AbstractStructural.call(this, parent, stage));

            _this.template = 'Gene_BlueFoot/component/stage/structural/column.html';
            _this.columnDefinition = ko.observable(_config2.default.getInitConfig('column_definitions')[0]);
            _this.widthClasses = ko.computed(function () {
                return this.columnDefinition()['className'];
            }, _this);
            _this.serializedWidth = ko.computed(function () {
                return this.columnDefinition()['breakpoint'] * 100;
            }, _this);
            _this.options.push(new _option.Option(_this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10));
            return _this;
        }
        /**
         * Add a column to self
         *
         * @param data
         * @returns {Column}
         */


        Column.prototype.addColumn = function addColumn(data) {
            var column = new Column(this, this.stage);
            this.addChild(column);
            column.updateColumnData(data);
            return column;
        };
        /**
         * Insert a column at a specific instance
         *
         * @param direction
         * @param item
         * @param data
         * @returns {Column}
         */


        Column.prototype.insertColumnAtIndex = function insertColumnAtIndex(direction, item, data) {
            var index = ko.utils.arrayIndexOf(item.parent.children(), item),
                column = new Column(item.parent, item.parent.stage);
            if (direction == 'right') {
                ++index;
            }
            (0, _array.moveArrayItemIntoArray)(column, item.parent.children, index);
            column.updateColumnData(data);
            return column;
        };
        /**
         * Update the column data to reflect the correct width
         *
         * @param data
         */


        Column.prototype.updateColumnData = function updateColumnData(data) {
            data = data || {};
            if (data.width) {
                var columnDef = _config2.default.getColumnDefinitionByBreakpoint(data.width);
                if (columnDef) {
                    this.columnDefinition(columnDef);
                }
            } else if (data.className) {
                this.columnDefinition(_config2.default.getColumnDefinitionByClassName(data.className));
            }
            this.data(data);
        };
        /**
         * Handle sort starting on column
         *
         * @param event
         * @param params
         * @returns {any}
         */


        Column.prototype.onSortStart = function onSortStart(event, params) {
            // Copy over the column class for the width
            jQuery(params.placeholder).addClass(this.widthClasses());
            return _AbstractStructural.prototype.onSortStart.call(this, event, params);
        };

        return Column;
    }(_abstract.AbstractStructural);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi50cyJdLCJuYW1lcyI6WyJDb2x1bW4iLCJwYXJlbnQiLCJzdGFnZSIsInRlbXBsYXRlIiwiY29sdW1uRGVmaW5pdGlvbiIsImtvIiwib2JzZXJ2YWJsZSIsImdldEluaXRDb25maWciLCJ3aWR0aENsYXNzZXMiLCJjb21wdXRlZCIsInNlcmlhbGl6ZWRXaWR0aCIsIm9wdGlvbnMiLCJwdXNoIiwiYWRkQ29sdW1uIiwiZGF0YSIsImNvbHVtbiIsImFkZENoaWxkIiwidXBkYXRlQ29sdW1uRGF0YSIsImluc2VydENvbHVtbkF0SW5kZXgiLCJkaXJlY3Rpb24iLCJpdGVtIiwiaW5kZXgiLCJ1dGlscyIsImFycmF5SW5kZXhPZiIsImNoaWxkcmVuIiwid2lkdGgiLCJjb2x1bW5EZWYiLCJnZXRDb2x1bW5EZWZpbml0aW9uQnlCcmVha3BvaW50IiwiY2xhc3NOYW1lIiwiZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5Q2xhc3NOYW1lIiwib25Tb3J0U3RhcnQiLCJldmVudCIsInBhcmFtcyIsImpRdWVyeSIsInBsYWNlaG9sZGVyIiwiYWRkQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFlTUEsTSxXQUFBQSxNOzs7QUFXRjs7Ozs7O0FBTUEsd0JBQVlDLE1BQVosRUFBMkNDLEtBQTNDLEVBQWdFO0FBQUE7O0FBQUEseURBQzVELCtCQUFNRCxNQUFOLEVBQWNDLEtBQWQsQ0FENEQ7O0FBaEJoRSxrQkFBQUMsUUFBQSxHQUFtQixzREFBbkI7QUFFQSxrQkFBQUMsZ0JBQUEsR0FBK0NDLEdBQUdDLFVBQUgsQ0FBYyxpQkFBT0MsYUFBUCxDQUFxQixvQkFBckIsRUFBMkMsQ0FBM0MsQ0FBZCxDQUEvQztBQUNBLGtCQUFBQyxZQUFBLEdBQXlDSCxHQUFHSSxRQUFILENBQVksWUFBQTtBQUNqRCx1QkFBTyxLQUFLTCxnQkFBTCxHQUF3QixXQUF4QixDQUFQO0FBQ0gsYUFGd0MsUUFBekM7QUFHQSxrQkFBQU0sZUFBQSxHQUE0Q0wsR0FBR0ksUUFBSCxDQUFZLFlBQUE7QUFDcEQsdUJBQU8sS0FBS0wsZ0JBQUwsR0FBd0IsWUFBeEIsSUFBd0MsR0FBL0M7QUFDSCxhQUYyQyxRQUE1QztBQWFJLGtCQUFLTyxPQUFMLENBQWFDLElBQWIsQ0FDSSwwQkFBaUIsUUFBakIsRUFBMkIsVUFBM0IsRUFBdUMsWUFBdkMsRUFBcUQsS0FBckQsRUFBNEQsQ0FBQyxZQUFELENBQTVELEVBQTRFLEVBQTVFLENBREo7QUFINEQ7QUFNL0Q7QUFFRDs7Ozs7Ozs7eUJBTUFDLFMsc0JBQVVDLEksRUFBYTtBQUNuQixnQkFBSUMsU0FBUyxJQUFJZixNQUFKLENBQVcsSUFBWCxFQUFpQixLQUFLRSxLQUF0QixDQUFiO0FBQ0EsaUJBQUtjLFFBQUwsQ0FBY0QsTUFBZDtBQUNBQSxtQkFBT0UsZ0JBQVAsQ0FBd0JILElBQXhCO0FBQ0EsbUJBQU9DLE1BQVA7QUFDSCxTO0FBRUQ7Ozs7Ozs7Ozs7eUJBUUFHLG1CLGdDQUFvQkMsUyxFQUFtQkMsSSxFQUFjTixJLEVBQVk7QUFDN0QsZ0JBQUlPLFFBQVFoQixHQUFHaUIsS0FBSCxDQUFTQyxZQUFULENBQXNCSCxLQUFLbkIsTUFBTCxDQUFZdUIsUUFBWixFQUF0QixFQUE4Q0osSUFBOUMsQ0FBWjtBQUFBLGdCQUNJTCxTQUFTLElBQUlmLE1BQUosQ0FBV29CLEtBQUtuQixNQUFoQixFQUF3Qm1CLEtBQUtuQixNQUFMLENBQVlDLEtBQXBDLENBRGI7QUFHQSxnQkFBSWlCLGFBQWEsT0FBakIsRUFBMEI7QUFDdEIsa0JBQUVFLEtBQUY7QUFDSDtBQUVELCtDQUF1Qk4sTUFBdkIsRUFBK0JLLEtBQUtuQixNQUFMLENBQVl1QixRQUEzQyxFQUFxREgsS0FBckQ7QUFDQU4sbUJBQU9FLGdCQUFQLENBQXdCSCxJQUF4QjtBQUVBLG1CQUFPQyxNQUFQO0FBQ0gsUztBQUVEOzs7Ozs7O3lCQUtBRSxnQiw2QkFBaUJILEksRUFBZ0I7QUFDN0JBLG1CQUFPQSxRQUFRLEVBQWY7QUFDQSxnQkFBSUEsS0FBS1csS0FBVCxFQUFnQjtBQUNaLG9CQUFJQyxZQUFZLGlCQUFPQywrQkFBUCxDQUF1Q2IsS0FBS1csS0FBNUMsQ0FBaEI7QUFDQSxvQkFBSUMsU0FBSixFQUFlO0FBQ1gseUJBQUt0QixnQkFBTCxDQUFzQnNCLFNBQXRCO0FBQ0g7QUFDSixhQUxELE1BS08sSUFBSVosS0FBS2MsU0FBVCxFQUFvQjtBQUN2QixxQkFBS3hCLGdCQUFMLENBQXNCLGlCQUFPeUIsOEJBQVAsQ0FBc0NmLEtBQUtjLFNBQTNDLENBQXRCO0FBQ0g7QUFFRCxpQkFBS2QsSUFBTCxDQUFVQSxJQUFWO0FBQ0gsUztBQUVEOzs7Ozs7Ozs7eUJBT0FnQixXLHdCQUFZQyxLLEVBQWNDLE0sRUFBa0I7QUFDeEM7QUFDQUMsbUJBQU9ELE9BQU9FLFdBQWQsRUFBMkJDLFFBQTNCLENBQW9DLEtBQUszQixZQUFMLEVBQXBDO0FBRUEsbUJBQU8sOEJBQU1zQixXQUFOLFlBQWtCQyxLQUFsQixFQUF5QkMsTUFBekIsQ0FBUDtBQUNILFMiLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvY29sdW1uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWJzdHJhY3RTdHJ1Y3R1cmFsIH0gZnJvbSAnLi9hYnN0cmFjdCc7XG5pbXBvcnQgeyBDb2x1bW5JbnRlcmZhY2UgfSBmcm9tICcuL2NvbHVtbi5kJztcbmltcG9ydCBDb25maWcgIGZyb20gXCIuLi8uLi9jb25maWdcIjtcbmltcG9ydCB7IG1vdmVBcnJheUl0ZW1JbnRvQXJyYXkgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvYXJyYXlcIjtcbmltcG9ydCB7IFNvcnRQYXJhbXMgfSBmcm9tIFwiLi9lZGl0YWJsZS1hcmVhXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvblwiO1xuaW1wb3J0IHsgT3B0aW9uSW50ZXJmYWNlIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb24uZFwiO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9zdGFnZS5kJztcblxuLyoqXG4gKiBDb2x1bW4gY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbHVtbiBleHRlbmRzIEFic3RyYWN0U3RydWN0dXJhbCBpbXBsZW1lbnRzIENvbHVtbkludGVyZmFjZSB7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi5odG1sJztcblxuICAgIGNvbHVtbkRlZmluaXRpb246IEtub2Nrb3V0T2JzZXJ2YWJsZTxvYmplY3Q+ID0ga28ub2JzZXJ2YWJsZShDb25maWcuZ2V0SW5pdENvbmZpZygnY29sdW1uX2RlZmluaXRpb25zJylbMF0pO1xuICAgIHdpZHRoQ2xhc3NlczogS25vY2tvdXRDb21wdXRlZDxzdHJpbmc+ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbkRlZmluaXRpb24oKVsnY2xhc3NOYW1lJ107XG4gICAgfSwgdGhpcyk7XG4gICAgc2VyaWFsaXplZFdpZHRoOiBLbm9ja291dENvbXB1dGVkPG51bWJlcj4gPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbkRlZmluaXRpb24oKVsnYnJlYWtwb2ludCddICogMTAwO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogQWJzdHJhY3Qgc3RydWN0dXJhbCBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UpIHtcbiAgICAgICAgc3VwZXIocGFyZW50LCBzdGFnZSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLm9wdGlvbnMucHVzaChcbiAgICAgICAgICAgIG5ldyBPcHRpb24odGhpcywgJ2NvbHVtbicsICc8aT7umLo8L2k+JywgJ0FkZCBDb2x1bW4nLCBmYWxzZSwgWydhZGQtY29sdW1uJ10sIDEwKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbHVtbiB0byBzZWxmXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtDb2x1bW59XG4gICAgICovXG4gICAgYWRkQ29sdW1uKGRhdGE/OiBvYmplY3QpOiBDb2x1bW5JbnRlcmZhY2Uge1xuICAgICAgICBsZXQgY29sdW1uID0gbmV3IENvbHVtbih0aGlzLCB0aGlzLnN0YWdlKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChjb2x1bW4pO1xuICAgICAgICBjb2x1bW4udXBkYXRlQ29sdW1uRGF0YShkYXRhKTtcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgYSBjb2x1bW4gYXQgYSBzcGVjaWZpYyBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIGRpcmVjdGlvblxuICAgICAqIEBwYXJhbSBpdGVtXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7Q29sdW1ufVxuICAgICAqL1xuICAgIGluc2VydENvbHVtbkF0SW5kZXgoZGlyZWN0aW9uOiBzdHJpbmcsIGl0ZW06IENvbHVtbiwgZGF0YTogb2JqZWN0KSB7XG4gICAgICAgIGxldCBpbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihpdGVtLnBhcmVudC5jaGlsZHJlbigpLCBpdGVtKSxcbiAgICAgICAgICAgIGNvbHVtbiA9IG5ldyBDb2x1bW4oaXRlbS5wYXJlbnQsIGl0ZW0ucGFyZW50LnN0YWdlKTtcblxuICAgICAgICBpZiAoZGlyZWN0aW9uID09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICBtb3ZlQXJyYXlJdGVtSW50b0FycmF5KGNvbHVtbiwgaXRlbS5wYXJlbnQuY2hpbGRyZW4sIGluZGV4KTtcbiAgICAgICAgY29sdW1uLnVwZGF0ZUNvbHVtbkRhdGEoZGF0YSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIGNvbHVtbiBkYXRhIHRvIHJlZmxlY3QgdGhlIGNvcnJlY3Qgd2lkdGhcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgdXBkYXRlQ29sdW1uRGF0YShkYXRhOiBDb2x1bW5EYXRhKTogdm9pZCB7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBpZiAoZGF0YS53aWR0aCkge1xuICAgICAgICAgICAgbGV0IGNvbHVtbkRlZiA9IENvbmZpZy5nZXRDb2x1bW5EZWZpbml0aW9uQnlCcmVha3BvaW50KGRhdGEud2lkdGgpO1xuICAgICAgICAgICAgaWYgKGNvbHVtbkRlZikge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbihjb2x1bW5EZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbkRlZmluaXRpb24oQ29uZmlnLmdldENvbHVtbkRlZmluaXRpb25CeUNsYXNzTmFtZShkYXRhLmNsYXNzTmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBzb3J0IHN0YXJ0aW5nIG9uIGNvbHVtblxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgb25Tb3J0U3RhcnQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IFNvcnRQYXJhbXMpIHtcbiAgICAgICAgLy8gQ29weSBvdmVyIHRoZSBjb2x1bW4gY2xhc3MgZm9yIHRoZSB3aWR0aFxuICAgICAgICBqUXVlcnkocGFyYW1zLnBsYWNlaG9sZGVyKS5hZGRDbGFzcyh0aGlzLndpZHRoQ2xhc3NlcygpKTtcblxuICAgICAgICByZXR1cm4gc3VwZXIub25Tb3J0U3RhcnQoZXZlbnQsIHBhcmFtcyk7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgQ29sdW1uRGF0YSB7XG4gICAgd2lkdGg/OiBudW1iZXIsXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nXG59Il19
