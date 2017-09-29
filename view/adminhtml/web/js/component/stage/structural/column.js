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
            this.stage.store.update(this.id, data);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi50cyJdLCJuYW1lcyI6WyJDb2x1bW4iLCJwYXJlbnQiLCJzdGFnZSIsInRlbXBsYXRlIiwiY29sdW1uRGVmaW5pdGlvbiIsImtvIiwib2JzZXJ2YWJsZSIsImdldEluaXRDb25maWciLCJ3aWR0aENsYXNzZXMiLCJjb21wdXRlZCIsInNlcmlhbGl6ZWRXaWR0aCIsIm9wdGlvbnMiLCJwdXNoIiwiYWRkQ29sdW1uIiwiZGF0YSIsImNvbHVtbiIsImFkZENoaWxkIiwidXBkYXRlQ29sdW1uRGF0YSIsImluc2VydENvbHVtbkF0SW5kZXgiLCJkaXJlY3Rpb24iLCJpdGVtIiwiaW5kZXgiLCJ1dGlscyIsImFycmF5SW5kZXhPZiIsImNoaWxkcmVuIiwid2lkdGgiLCJjb2x1bW5EZWYiLCJnZXRDb2x1bW5EZWZpbml0aW9uQnlCcmVha3BvaW50IiwiY2xhc3NOYW1lIiwiZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5Q2xhc3NOYW1lIiwic3RvcmUiLCJ1cGRhdGUiLCJpZCIsIm9uU29ydFN0YXJ0IiwiZXZlbnQiLCJwYXJhbXMiLCJqUXVlcnkiLCJwbGFjZWhvbGRlciIsImFkZENsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBZ0JNQSxNLFdBQUFBLE07OztBQVdGOzs7Ozs7QUFNQSx3QkFBWUMsTUFBWixFQUEyQ0MsS0FBM0MsRUFBZ0U7QUFBQTs7QUFBQSx5REFDNUQsK0JBQU1ELE1BQU4sRUFBY0MsS0FBZCxDQUQ0RDs7QUFoQmhFLGtCQUFBQyxRQUFBLEdBQW1CLHNEQUFuQjtBQUVBLGtCQUFBQyxnQkFBQSxHQUErQ0MsR0FBR0MsVUFBSCxDQUFjLGlCQUFPQyxhQUFQLENBQXFCLG9CQUFyQixFQUEyQyxDQUEzQyxDQUFkLENBQS9DO0FBQ0Esa0JBQUFDLFlBQUEsR0FBeUNILEdBQUdJLFFBQUgsQ0FBWSxZQUFBO0FBQ2pELHVCQUFPLEtBQUtMLGdCQUFMLEdBQXdCLFdBQXhCLENBQVA7QUFDSCxhQUZ3QyxRQUF6QztBQUdBLGtCQUFBTSxlQUFBLEdBQTRDTCxHQUFHSSxRQUFILENBQVksWUFBQTtBQUNwRCx1QkFBTyxLQUFLTCxnQkFBTCxHQUF3QixZQUF4QixJQUF3QyxHQUEvQztBQUNILGFBRjJDLFFBQTVDO0FBYUksa0JBQUtPLE9BQUwsQ0FBYUMsSUFBYixDQUNJLDBCQUFpQixRQUFqQixFQUEyQixVQUEzQixFQUF1QyxZQUF2QyxFQUFxRCxLQUFyRCxFQUE0RCxDQUFDLFlBQUQsQ0FBNUQsRUFBNEUsRUFBNUUsQ0FESjtBQUg0RDtBQU0vRDtBQUVEOzs7Ozs7Ozt5QkFNQUMsUyxzQkFBVUMsSSxFQUFpQjtBQUN2QixnQkFBSUMsU0FBUyxJQUFJZixNQUFKLENBQVcsSUFBWCxFQUFpQixLQUFLRSxLQUF0QixDQUFiO0FBQ0EsaUJBQUtjLFFBQUwsQ0FBY0QsTUFBZDtBQUNBQSxtQkFBT0UsZ0JBQVAsQ0FBd0JILElBQXhCO0FBQ0EsbUJBQU9DLE1BQVA7QUFDSCxTO0FBRUQ7Ozs7Ozs7Ozs7eUJBUUFHLG1CLGdDQUFvQkMsUyxFQUFtQkMsSSxFQUFjTixJLEVBQWdCO0FBQ2pFLGdCQUFJTyxRQUFRaEIsR0FBR2lCLEtBQUgsQ0FBU0MsWUFBVCxDQUFzQkgsS0FBS25CLE1BQUwsQ0FBWXVCLFFBQVosRUFBdEIsRUFBOENKLElBQTlDLENBQVo7QUFBQSxnQkFDSUwsU0FBUyxJQUFJZixNQUFKLENBQVdvQixLQUFLbkIsTUFBaEIsRUFBd0JtQixLQUFLbkIsTUFBTCxDQUFZQyxLQUFwQyxDQURiO0FBR0EsZ0JBQUlpQixhQUFhLE9BQWpCLEVBQTBCO0FBQ3RCLGtCQUFFRSxLQUFGO0FBQ0g7QUFFRCwrQ0FBdUJOLE1BQXZCLEVBQStCSyxLQUFLbkIsTUFBTCxDQUFZdUIsUUFBM0MsRUFBcURILEtBQXJEO0FBQ0FOLG1CQUFPRSxnQkFBUCxDQUF3QkgsSUFBeEI7QUFFQSxtQkFBT0MsTUFBUDtBQUNILFM7QUFFRDs7Ozs7Ozt5QkFLQUUsZ0IsNkJBQWlCSCxJLEVBQWdCO0FBQzdCQSxtQkFBT0EsUUFBUSxFQUFmO0FBQ0EsZ0JBQUlBLEtBQUtXLEtBQVQsRUFBZ0I7QUFDWixvQkFBSUMsWUFBWSxpQkFBT0MsK0JBQVAsQ0FBdUNiLEtBQUtXLEtBQTVDLENBQWhCO0FBQ0Esb0JBQUlDLFNBQUosRUFBZTtBQUNYLHlCQUFLdEIsZ0JBQUwsQ0FBc0JzQixTQUF0QjtBQUNIO0FBQ0osYUFMRCxNQUtPLElBQUlaLEtBQUtjLFNBQVQsRUFBb0I7QUFDdkIscUJBQUt4QixnQkFBTCxDQUFzQixpQkFBT3lCLDhCQUFQLENBQXNDZixLQUFLYyxTQUEzQyxDQUF0QjtBQUNIO0FBRUQsaUJBQUsxQixLQUFMLENBQVc0QixLQUFYLENBQWlCQyxNQUFqQixDQUF3QixLQUFLQyxFQUE3QixFQUFpQ2xCLElBQWpDO0FBQ0gsUztBQUVEOzs7Ozs7Ozs7eUJBT0FtQixXLHdCQUFZQyxLLEVBQWNDLE0sRUFBa0I7QUFDeEM7QUFDQUMsbUJBQU9ELE9BQU9FLFdBQWQsRUFBMkJDLFFBQTNCLENBQW9DLEtBQUs5QixZQUFMLEVBQXBDO0FBRUEsbUJBQU8sOEJBQU15QixXQUFOLFlBQWtCQyxLQUFsQixFQUF5QkMsTUFBekIsQ0FBUDtBQUNILFMiLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvY29sdW1uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWJzdHJhY3RTdHJ1Y3R1cmFsIH0gZnJvbSAnLi9hYnN0cmFjdCc7XG5pbXBvcnQgeyBDb2x1bW5JbnRlcmZhY2UgfSBmcm9tICcuL2NvbHVtbi5kJztcbmltcG9ydCBDb25maWcgIGZyb20gXCIuLi8uLi9jb25maWdcIjtcbmltcG9ydCB7IG1vdmVBcnJheUl0ZW1JbnRvQXJyYXkgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvYXJyYXlcIjtcbmltcG9ydCB7IFNvcnRQYXJhbXMgfSBmcm9tIFwiLi9lZGl0YWJsZS1hcmVhXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvblwiO1xuaW1wb3J0IHsgT3B0aW9uSW50ZXJmYWNlIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb24uZFwiO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9zdGFnZS5kJztcbmltcG9ydCB7IERhdGFPYmplY3QgfSBmcm9tIFwiLi4vLi4vZGF0YS1zdG9yZVwiO1xuXG4vKipcbiAqIENvbHVtbiBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgQ29sdW1uIGV4dGVuZHMgQWJzdHJhY3RTdHJ1Y3R1cmFsIGltcGxlbWVudHMgQ29sdW1uSW50ZXJmYWNlIHtcbiAgICB0ZW1wbGF0ZTogc3RyaW5nID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvY29sdW1uLmh0bWwnO1xuXG4gICAgY29sdW1uRGVmaW5pdGlvbjogS25vY2tvdXRPYnNlcnZhYmxlPG9iamVjdD4gPSBrby5vYnNlcnZhYmxlKENvbmZpZy5nZXRJbml0Q29uZmlnKCdjb2x1bW5fZGVmaW5pdGlvbnMnKVswXSk7XG4gICAgd2lkdGhDbGFzc2VzOiBLbm9ja291dENvbXB1dGVkPHN0cmluZz4gPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmaW5pdGlvbigpWydjbGFzc05hbWUnXTtcbiAgICB9LCB0aGlzKTtcbiAgICBzZXJpYWxpemVkV2lkdGg6IEtub2Nrb3V0Q29tcHV0ZWQ8bnVtYmVyPiA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmaW5pdGlvbigpWydicmVha3BvaW50J10gKiAxMDA7XG4gICAgfSwgdGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBBYnN0cmFjdCBzdHJ1Y3R1cmFsIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBFZGl0YWJsZUFyZWFJbnRlcmZhY2UsIHN0YWdlOiBTdGFnZUludGVyZmFjZSkge1xuICAgICAgICBzdXBlcihwYXJlbnQsIHN0YWdlKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub3B0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnY29sdW1uJywgJzxpPu6YujwvaT4nLCAnQWRkIENvbHVtbicsIGZhbHNlLCBbJ2FkZC1jb2x1bW4nXSwgMTApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29sdW1uIHRvIHNlbGZcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge0NvbHVtbn1cbiAgICAgKi9cbiAgICBhZGRDb2x1bW4oZGF0YT86IENvbHVtbkRhdGEpOiBDb2x1bW5JbnRlcmZhY2Uge1xuICAgICAgICBsZXQgY29sdW1uID0gbmV3IENvbHVtbih0aGlzLCB0aGlzLnN0YWdlKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChjb2x1bW4pO1xuICAgICAgICBjb2x1bW4udXBkYXRlQ29sdW1uRGF0YShkYXRhKTtcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgYSBjb2x1bW4gYXQgYSBzcGVjaWZpYyBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIGRpcmVjdGlvblxuICAgICAqIEBwYXJhbSBpdGVtXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7Q29sdW1ufVxuICAgICAqL1xuICAgIGluc2VydENvbHVtbkF0SW5kZXgoZGlyZWN0aW9uOiBzdHJpbmcsIGl0ZW06IENvbHVtbiwgZGF0YTogQ29sdW1uRGF0YSkge1xuICAgICAgICBsZXQgaW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YoaXRlbS5wYXJlbnQuY2hpbGRyZW4oKSwgaXRlbSksXG4gICAgICAgICAgICBjb2x1bW4gPSBuZXcgQ29sdW1uKGl0ZW0ucGFyZW50LCBpdGVtLnBhcmVudC5zdGFnZSk7XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PSAncmlnaHQnKSB7XG4gICAgICAgICAgICArK2luZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbW92ZUFycmF5SXRlbUludG9BcnJheShjb2x1bW4sIGl0ZW0ucGFyZW50LmNoaWxkcmVuLCBpbmRleCk7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuXG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBjb2x1bW4gZGF0YSB0byByZWZsZWN0IHRoZSBjb3JyZWN0IHdpZHRoXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIHVwZGF0ZUNvbHVtbkRhdGEoZGF0YTogQ29sdW1uRGF0YSk6IHZvaWQge1xuICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgaWYgKGRhdGEud2lkdGgpIHtcbiAgICAgICAgICAgIGxldCBjb2x1bW5EZWYgPSBDb25maWcuZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5QnJlYWtwb2ludChkYXRhLndpZHRoKTtcbiAgICAgICAgICAgIGlmIChjb2x1bW5EZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbkRlZmluaXRpb24oY29sdW1uRGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uKENvbmZpZy5nZXRDb2x1bW5EZWZpbml0aW9uQnlDbGFzc05hbWUoZGF0YS5jbGFzc05hbWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhZ2Uuc3RvcmUudXBkYXRlKHRoaXMuaWQsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBzb3J0IHN0YXJ0aW5nIG9uIGNvbHVtblxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgb25Tb3J0U3RhcnQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IFNvcnRQYXJhbXMpIHtcbiAgICAgICAgLy8gQ29weSBvdmVyIHRoZSBjb2x1bW4gY2xhc3MgZm9yIHRoZSB3aWR0aFxuICAgICAgICBqUXVlcnkocGFyYW1zLnBsYWNlaG9sZGVyKS5hZGRDbGFzcyh0aGlzLndpZHRoQ2xhc3NlcygpKTtcblxuICAgICAgICByZXR1cm4gc3VwZXIub25Tb3J0U3RhcnQoZXZlbnQsIHBhcmFtcyk7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbHVtbkRhdGEgZXh0ZW5kcyBEYXRhT2JqZWN0IHtcbiAgICB3aWR0aD86IG51bWJlcixcbiAgICBjbGFzc05hbWU/OiBzdHJpbmdcbn0iXX0=
