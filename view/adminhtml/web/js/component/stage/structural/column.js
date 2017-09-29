define(["exports", "./abstract", "../../config", "../../../utils/array", "./options/option", "knockout"], function (exports, _abstract, _config, _array, _option, _knockout) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Column = undefined;

    var _config2 = _interopRequireDefault(_config);

    var _knockout2 = _interopRequireDefault(_knockout);

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
            _this.columnDefinition = _knockout2.default.observable(_config2.default.getInitConfig('column_definitions')[0]);
            _this.widthClasses = _knockout2.default.computed(function () {
                return this.columnDefinition()['className'];
            }, _this);
            _this.serializedWidth = _knockout2.default.computed(function () {
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
            var index = _knockout2.default.utils.arrayIndexOf(item.parent.children(), item),
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi50cyJdLCJuYW1lcyI6WyJDb2x1bW4iLCJwYXJlbnQiLCJzdGFnZSIsInRlbXBsYXRlIiwiY29sdW1uRGVmaW5pdGlvbiIsIm9ic2VydmFibGUiLCJnZXRJbml0Q29uZmlnIiwid2lkdGhDbGFzc2VzIiwiY29tcHV0ZWQiLCJzZXJpYWxpemVkV2lkdGgiLCJvcHRpb25zIiwicHVzaCIsImFkZENvbHVtbiIsImRhdGEiLCJjb2x1bW4iLCJhZGRDaGlsZCIsInVwZGF0ZUNvbHVtbkRhdGEiLCJpbnNlcnRDb2x1bW5BdEluZGV4IiwiZGlyZWN0aW9uIiwiaXRlbSIsImluZGV4IiwidXRpbHMiLCJhcnJheUluZGV4T2YiLCJjaGlsZHJlbiIsIndpZHRoIiwiY29sdW1uRGVmIiwiZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5QnJlYWtwb2ludCIsImNsYXNzTmFtZSIsImdldENvbHVtbkRlZmluaXRpb25CeUNsYXNzTmFtZSIsIm9uU29ydFN0YXJ0IiwiZXZlbnQiLCJwYXJhbXMiLCJqUXVlcnkiLCJwbGFjZWhvbGRlciIsImFkZENsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFpQk1BLE0sV0FBQUEsTTs7O0FBV0Y7Ozs7OztBQU1BLHdCQUFZQyxNQUFaLEVBQTJDQyxLQUEzQyxFQUFnRTtBQUFBOztBQUFBLHlEQUM1RCwrQkFBTUQsTUFBTixFQUFjQyxLQUFkLENBRDREOztBQWhCaEUsa0JBQUFDLFFBQUEsR0FBbUIsc0RBQW5CO0FBRUEsa0JBQUFDLGdCQUFBLEdBQStDLG1CQUFHQyxVQUFILENBQWMsaUJBQU9DLGFBQVAsQ0FBcUIsb0JBQXJCLEVBQTJDLENBQTNDLENBQWQsQ0FBL0M7QUFDQSxrQkFBQUMsWUFBQSxHQUF5QyxtQkFBR0MsUUFBSCxDQUFZLFlBQUE7QUFDakQsdUJBQU8sS0FBS0osZ0JBQUwsR0FBd0IsV0FBeEIsQ0FBUDtBQUNILGFBRndDLFFBQXpDO0FBR0Esa0JBQUFLLGVBQUEsR0FBNEMsbUJBQUdELFFBQUgsQ0FBWSxZQUFBO0FBQ3BELHVCQUFPLEtBQUtKLGdCQUFMLEdBQXdCLFlBQXhCLElBQXdDLEdBQS9DO0FBQ0gsYUFGMkMsUUFBNUM7QUFhSSxrQkFBS00sT0FBTCxDQUFhQyxJQUFiLENBQ0ksMEJBQWlCLFFBQWpCLEVBQTJCLFVBQTNCLEVBQXVDLFlBQXZDLEVBQXFELEtBQXJELEVBQTRELENBQUMsWUFBRCxDQUE1RCxFQUE0RSxFQUE1RSxDQURKO0FBSDREO0FBTS9EO0FBRUQ7Ozs7Ozs7O3lCQU1BQyxTLHNCQUFVQyxJLEVBQWE7QUFDbkIsZ0JBQUlDLFNBQVMsSUFBSWQsTUFBSixDQUFXLElBQVgsRUFBaUIsS0FBS0UsS0FBdEIsQ0FBYjtBQUNBLGlCQUFLYSxRQUFMLENBQWNELE1BQWQ7QUFDQUEsbUJBQU9FLGdCQUFQLENBQXdCSCxJQUF4QjtBQUNBLG1CQUFPQyxNQUFQO0FBQ0gsUztBQUVEOzs7Ozs7Ozs7O3lCQVFBRyxtQixnQ0FBb0JDLFMsRUFBbUJDLEksRUFBY04sSSxFQUFZO0FBQzdELGdCQUFJTyxRQUFRLG1CQUFHQyxLQUFILENBQVNDLFlBQVQsQ0FBc0JILEtBQUtsQixNQUFMLENBQVlzQixRQUFaLEVBQXRCLEVBQThDSixJQUE5QyxDQUFaO0FBQUEsZ0JBQ0lMLFNBQVMsSUFBSWQsTUFBSixDQUFXbUIsS0FBS2xCLE1BQWhCLEVBQXdCa0IsS0FBS2xCLE1BQUwsQ0FBWUMsS0FBcEMsQ0FEYjtBQUdBLGdCQUFJZ0IsYUFBYSxPQUFqQixFQUEwQjtBQUN0QixrQkFBRUUsS0FBRjtBQUNIO0FBRUQsK0NBQXVCTixNQUF2QixFQUErQkssS0FBS2xCLE1BQUwsQ0FBWXNCLFFBQTNDLEVBQXFESCxLQUFyRDtBQUNBTixtQkFBT0UsZ0JBQVAsQ0FBd0JILElBQXhCO0FBRUEsbUJBQU9DLE1BQVA7QUFDSCxTO0FBRUQ7Ozs7Ozs7eUJBS0FFLGdCLDZCQUFpQkgsSSxFQUFnQjtBQUM3QkEsbUJBQU9BLFFBQVEsRUFBZjtBQUNBLGdCQUFJQSxLQUFLVyxLQUFULEVBQWdCO0FBQ1osb0JBQUlDLFlBQVksaUJBQU9DLCtCQUFQLENBQXVDYixLQUFLVyxLQUE1QyxDQUFoQjtBQUNBLG9CQUFJQyxTQUFKLEVBQWU7QUFDWCx5QkFBS3JCLGdCQUFMLENBQXNCcUIsU0FBdEI7QUFDSDtBQUNKLGFBTEQsTUFLTyxJQUFJWixLQUFLYyxTQUFULEVBQW9CO0FBQ3ZCLHFCQUFLdkIsZ0JBQUwsQ0FBc0IsaUJBQU93Qiw4QkFBUCxDQUFzQ2YsS0FBS2MsU0FBM0MsQ0FBdEI7QUFDSDtBQUVELGlCQUFLZCxJQUFMLENBQVVBLElBQVY7QUFDSCxTO0FBRUQ7Ozs7Ozs7Ozt5QkFPQWdCLFcsd0JBQVlDLEssRUFBY0MsTSxFQUFrQjtBQUN4QztBQUNBQyxtQkFBT0QsT0FBT0UsV0FBZCxFQUEyQkMsUUFBM0IsQ0FBb0MsS0FBSzNCLFlBQUwsRUFBcEM7QUFFQSxtQkFBTyw4QkFBTXNCLFdBQU4sWUFBa0JDLEtBQWxCLEVBQXlCQyxNQUF6QixDQUFQO0FBQ0gsUyIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jb2x1bW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYnN0cmFjdFN0cnVjdHVyYWwgfSBmcm9tICcuL2Fic3RyYWN0JztcbmltcG9ydCB7IENvbHVtbkludGVyZmFjZSB9IGZyb20gJy4vY29sdW1uLmQnO1xuaW1wb3J0IENvbmZpZyAgZnJvbSBcIi4uLy4uL2NvbmZpZ1wiO1xuaW1wb3J0IHsgbW92ZUFycmF5SXRlbUludG9BcnJheSB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9hcnJheVwiO1xuaW1wb3J0IHsgU29ydFBhcmFtcyB9IGZyb20gXCIuL2VkaXRhYmxlLWFyZWFcIjtcbmltcG9ydCB7IE9wdGlvbiB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uXCI7XG5pbXBvcnQgeyBPcHRpb25JbnRlcmZhY2UgfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvbi5kXCI7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuL2VkaXRhYmxlLWFyZWEuZCc7XG5pbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4uLy4uL3N0YWdlLmQnO1xuXG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuXG4vKipcbiAqIENvbHVtbiBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgQ29sdW1uIGV4dGVuZHMgQWJzdHJhY3RTdHJ1Y3R1cmFsIGltcGxlbWVudHMgQ29sdW1uSW50ZXJmYWNlIHtcbiAgICB0ZW1wbGF0ZTogc3RyaW5nID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvY29sdW1uLmh0bWwnO1xuXG4gICAgY29sdW1uRGVmaW5pdGlvbjogS25vY2tvdXRPYnNlcnZhYmxlPG9iamVjdD4gPSBrby5vYnNlcnZhYmxlKENvbmZpZy5nZXRJbml0Q29uZmlnKCdjb2x1bW5fZGVmaW5pdGlvbnMnKVswXSk7XG4gICAgd2lkdGhDbGFzc2VzOiBLbm9ja291dENvbXB1dGVkPHN0cmluZz4gPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmaW5pdGlvbigpWydjbGFzc05hbWUnXTtcbiAgICB9LCB0aGlzKTtcbiAgICBzZXJpYWxpemVkV2lkdGg6IEtub2Nrb3V0Q29tcHV0ZWQ8bnVtYmVyPiA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmaW5pdGlvbigpWydicmVha3BvaW50J10gKiAxMDA7XG4gICAgfSwgdGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBBYnN0cmFjdCBzdHJ1Y3R1cmFsIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBFZGl0YWJsZUFyZWFJbnRlcmZhY2UsIHN0YWdlOiBTdGFnZUludGVyZmFjZSkge1xuICAgICAgICBzdXBlcihwYXJlbnQsIHN0YWdlKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub3B0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnY29sdW1uJywgJzxpPu6YujwvaT4nLCAnQWRkIENvbHVtbicsIGZhbHNlLCBbJ2FkZC1jb2x1bW4nXSwgMTApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29sdW1uIHRvIHNlbGZcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge0NvbHVtbn1cbiAgICAgKi9cbiAgICBhZGRDb2x1bW4oZGF0YT86IG9iamVjdCk6IENvbHVtbkludGVyZmFjZSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBuZXcgQ29sdW1uKHRoaXMsIHRoaXMuc3RhZ2UpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGNvbHVtbik7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluc2VydCBhIGNvbHVtbiBhdCBhIHNwZWNpZmljIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uXG4gICAgICogQHBhcmFtIGl0ZW1cbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtDb2x1bW59XG4gICAgICovXG4gICAgaW5zZXJ0Q29sdW1uQXRJbmRleChkaXJlY3Rpb246IHN0cmluZywgaXRlbTogQ29sdW1uLCBkYXRhOiBvYmplY3QpIHtcbiAgICAgICAgbGV0IGluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKGl0ZW0ucGFyZW50LmNoaWxkcmVuKCksIGl0ZW0pLFxuICAgICAgICAgICAgY29sdW1uID0gbmV3IENvbHVtbihpdGVtLnBhcmVudCwgaXRlbS5wYXJlbnQuc3RhZ2UpO1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vdmVBcnJheUl0ZW1JbnRvQXJyYXkoY29sdW1uLCBpdGVtLnBhcmVudC5jaGlsZHJlbiwgaW5kZXgpO1xuICAgICAgICBjb2x1bW4udXBkYXRlQ29sdW1uRGF0YShkYXRhKTtcblxuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgY29sdW1uIGRhdGEgdG8gcmVmbGVjdCB0aGUgY29ycmVjdCB3aWR0aFxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICB1cGRhdGVDb2x1bW5EYXRhKGRhdGE6IENvbHVtbkRhdGEpOiB2b2lkIHtcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIGlmIChkYXRhLndpZHRoKSB7XG4gICAgICAgICAgICBsZXQgY29sdW1uRGVmID0gQ29uZmlnLmdldENvbHVtbkRlZmluaXRpb25CeUJyZWFrcG9pbnQoZGF0YS53aWR0aCk7XG4gICAgICAgICAgICBpZiAoY29sdW1uRGVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uKGNvbHVtbkRlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbihDb25maWcuZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5Q2xhc3NOYW1lKGRhdGEuY2xhc3NOYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRhdGEoZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHNvcnQgc3RhcnRpbmcgb24gY29sdW1uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBvblNvcnRTdGFydChldmVudDogRXZlbnQsIHBhcmFtczogU29ydFBhcmFtcykge1xuICAgICAgICAvLyBDb3B5IG92ZXIgdGhlIGNvbHVtbiBjbGFzcyBmb3IgdGhlIHdpZHRoXG4gICAgICAgIGpRdWVyeShwYXJhbXMucGxhY2Vob2xkZXIpLmFkZENsYXNzKHRoaXMud2lkdGhDbGFzc2VzKCkpO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5vblNvcnRTdGFydChldmVudCwgcGFyYW1zKTtcbiAgICB9XG59XG5cbmludGVyZmFjZSBDb2x1bW5EYXRhIHtcbiAgICB3aWR0aD86IG51bWJlcixcbiAgICBjbGFzc05hbWU/OiBzdHJpbmdcbn0iXX0=
