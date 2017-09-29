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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi50cyJdLCJuYW1lcyI6WyJDb2x1bW4iLCJwYXJlbnQiLCJzdGFnZSIsInRlbXBsYXRlIiwiY29sdW1uRGVmaW5pdGlvbiIsIm9ic2VydmFibGUiLCJnZXRJbml0Q29uZmlnIiwid2lkdGhDbGFzc2VzIiwiY29tcHV0ZWQiLCJzZXJpYWxpemVkV2lkdGgiLCJvcHRpb25zIiwicHVzaCIsImFkZENvbHVtbiIsImRhdGEiLCJjb2x1bW4iLCJhZGRDaGlsZCIsInVwZGF0ZUNvbHVtbkRhdGEiLCJpbnNlcnRDb2x1bW5BdEluZGV4IiwiZGlyZWN0aW9uIiwiaXRlbSIsImluZGV4IiwidXRpbHMiLCJhcnJheUluZGV4T2YiLCJjaGlsZHJlbiIsIndpZHRoIiwiY29sdW1uRGVmIiwiZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5QnJlYWtwb2ludCIsImNsYXNzTmFtZSIsImdldENvbHVtbkRlZmluaXRpb25CeUNsYXNzTmFtZSIsInN0b3JlIiwidXBkYXRlIiwiaWQiLCJvblNvcnRTdGFydCIsImV2ZW50IiwicGFyYW1zIiwialF1ZXJ5IiwicGxhY2Vob2xkZXIiLCJhZGRDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBa0JNQSxNLFdBQUFBLE07OztBQVdGOzs7Ozs7QUFNQSx3QkFBWUMsTUFBWixFQUEyQ0MsS0FBM0MsRUFBZ0U7QUFBQTs7QUFBQSx5REFDNUQsK0JBQU1ELE1BQU4sRUFBY0MsS0FBZCxDQUQ0RDs7QUFoQmhFLGtCQUFBQyxRQUFBLEdBQW1CLHNEQUFuQjtBQUVBLGtCQUFBQyxnQkFBQSxHQUErQyxtQkFBR0MsVUFBSCxDQUFjLGlCQUFPQyxhQUFQLENBQXFCLG9CQUFyQixFQUEyQyxDQUEzQyxDQUFkLENBQS9DO0FBQ0Esa0JBQUFDLFlBQUEsR0FBeUMsbUJBQUdDLFFBQUgsQ0FBWSxZQUFBO0FBQ2pELHVCQUFPLEtBQUtKLGdCQUFMLEdBQXdCLFdBQXhCLENBQVA7QUFDSCxhQUZ3QyxRQUF6QztBQUdBLGtCQUFBSyxlQUFBLEdBQTRDLG1CQUFHRCxRQUFILENBQVksWUFBQTtBQUNwRCx1QkFBTyxLQUFLSixnQkFBTCxHQUF3QixZQUF4QixJQUF3QyxHQUEvQztBQUNILGFBRjJDLFFBQTVDO0FBYUksa0JBQUtNLE9BQUwsQ0FBYUMsSUFBYixDQUNJLDBCQUFpQixRQUFqQixFQUEyQixVQUEzQixFQUF1QyxZQUF2QyxFQUFxRCxLQUFyRCxFQUE0RCxDQUFDLFlBQUQsQ0FBNUQsRUFBNEUsRUFBNUUsQ0FESjtBQUg0RDtBQU0vRDtBQUVEOzs7Ozs7Ozt5QkFNQUMsUyxzQkFBVUMsSSxFQUFpQjtBQUN2QixnQkFBSUMsU0FBUyxJQUFJZCxNQUFKLENBQVcsSUFBWCxFQUFpQixLQUFLRSxLQUF0QixDQUFiO0FBQ0EsaUJBQUthLFFBQUwsQ0FBY0QsTUFBZDtBQUNBQSxtQkFBT0UsZ0JBQVAsQ0FBd0JILElBQXhCO0FBQ0EsbUJBQU9DLE1BQVA7QUFDSCxTO0FBRUQ7Ozs7Ozs7Ozs7eUJBUUFHLG1CLGdDQUFvQkMsUyxFQUFtQkMsSSxFQUFjTixJLEVBQWdCO0FBQ2pFLGdCQUFJTyxRQUFRLG1CQUFHQyxLQUFILENBQVNDLFlBQVQsQ0FBc0JILEtBQUtsQixNQUFMLENBQVlzQixRQUFaLEVBQXRCLEVBQThDSixJQUE5QyxDQUFaO0FBQUEsZ0JBQ0lMLFNBQVMsSUFBSWQsTUFBSixDQUFXbUIsS0FBS2xCLE1BQWhCLEVBQXdCa0IsS0FBS2xCLE1BQUwsQ0FBWUMsS0FBcEMsQ0FEYjtBQUdBLGdCQUFJZ0IsYUFBYSxPQUFqQixFQUEwQjtBQUN0QixrQkFBRUUsS0FBRjtBQUNIO0FBRUQsK0NBQXVCTixNQUF2QixFQUErQkssS0FBS2xCLE1BQUwsQ0FBWXNCLFFBQTNDLEVBQXFESCxLQUFyRDtBQUNBTixtQkFBT0UsZ0JBQVAsQ0FBd0JILElBQXhCO0FBRUEsbUJBQU9DLE1BQVA7QUFDSCxTO0FBRUQ7Ozs7Ozs7eUJBS0FFLGdCLDZCQUFpQkgsSSxFQUFnQjtBQUM3QkEsbUJBQU9BLFFBQVEsRUFBZjtBQUNBLGdCQUFJQSxLQUFLVyxLQUFULEVBQWdCO0FBQ1osb0JBQUlDLFlBQVksaUJBQU9DLCtCQUFQLENBQXVDYixLQUFLVyxLQUE1QyxDQUFoQjtBQUNBLG9CQUFJQyxTQUFKLEVBQWU7QUFDWCx5QkFBS3JCLGdCQUFMLENBQXNCcUIsU0FBdEI7QUFDSDtBQUNKLGFBTEQsTUFLTyxJQUFJWixLQUFLYyxTQUFULEVBQW9CO0FBQ3ZCLHFCQUFLdkIsZ0JBQUwsQ0FBc0IsaUJBQU93Qiw4QkFBUCxDQUFzQ2YsS0FBS2MsU0FBM0MsQ0FBdEI7QUFDSDtBQUVELGlCQUFLekIsS0FBTCxDQUFXMkIsS0FBWCxDQUFpQkMsTUFBakIsQ0FBd0IsS0FBS0MsRUFBN0IsRUFBaUNsQixJQUFqQztBQUNILFM7QUFFRDs7Ozs7Ozs7O3lCQU9BbUIsVyx3QkFBWUMsSyxFQUFjQyxNLEVBQWtCO0FBQ3hDO0FBQ0FDLG1CQUFPRCxPQUFPRSxXQUFkLEVBQTJCQyxRQUEzQixDQUFvQyxLQUFLOUIsWUFBTCxFQUFwQztBQUVBLG1CQUFPLDhCQUFNeUIsV0FBTixZQUFrQkMsS0FBbEIsRUFBeUJDLE1BQXpCLENBQVA7QUFDSCxTIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QnO1xuaW1wb3J0IHsgQ29sdW1uSW50ZXJmYWNlIH0gZnJvbSAnLi9jb2x1bW4uZCc7XG5pbXBvcnQgQ29uZmlnICBmcm9tIFwiLi4vLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBtb3ZlQXJyYXlJdGVtSW50b0FycmF5IH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2FycmF5XCI7XG5pbXBvcnQgeyBTb3J0UGFyYW1zIH0gZnJvbSBcIi4vZWRpdGFibGUtYXJlYVwiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb25cIjtcbmltcG9ydCB7IE9wdGlvbkludGVyZmFjZSB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uLmRcIjtcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4vZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vc3RhZ2UuZCc7XG5pbXBvcnQgeyBEYXRhT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2RhdGEtc3RvcmVcIjtcblxuaW1wb3J0IGtvIGZyb20gJ2tub2Nrb3V0JztcblxuLyoqXG4gKiBDb2x1bW4gY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbHVtbiBleHRlbmRzIEFic3RyYWN0U3RydWN0dXJhbCBpbXBsZW1lbnRzIENvbHVtbkludGVyZmFjZSB7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi5odG1sJztcblxuICAgIGNvbHVtbkRlZmluaXRpb246IEtub2Nrb3V0T2JzZXJ2YWJsZTxvYmplY3Q+ID0ga28ub2JzZXJ2YWJsZShDb25maWcuZ2V0SW5pdENvbmZpZygnY29sdW1uX2RlZmluaXRpb25zJylbMF0pO1xuICAgIHdpZHRoQ2xhc3NlczogS25vY2tvdXRDb21wdXRlZDxzdHJpbmc+ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbkRlZmluaXRpb24oKVsnY2xhc3NOYW1lJ107XG4gICAgfSwgdGhpcyk7XG4gICAgc2VyaWFsaXplZFdpZHRoOiBLbm9ja291dENvbXB1dGVkPG51bWJlcj4gPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbkRlZmluaXRpb24oKVsnYnJlYWtwb2ludCddICogMTAwO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogQWJzdHJhY3Qgc3RydWN0dXJhbCBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UpIHtcbiAgICAgICAgc3VwZXIocGFyZW50LCBzdGFnZSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLm9wdGlvbnMucHVzaChcbiAgICAgICAgICAgIG5ldyBPcHRpb24odGhpcywgJ2NvbHVtbicsICc8aT7umLo8L2k+JywgJ0FkZCBDb2x1bW4nLCBmYWxzZSwgWydhZGQtY29sdW1uJ10sIDEwKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbHVtbiB0byBzZWxmXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtDb2x1bW59XG4gICAgICovXG4gICAgYWRkQ29sdW1uKGRhdGE/OiBDb2x1bW5EYXRhKTogQ29sdW1uSW50ZXJmYWNlIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IG5ldyBDb2x1bW4odGhpcywgdGhpcy5zdGFnZSk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoY29sdW1uKTtcbiAgICAgICAgY29sdW1uLnVwZGF0ZUNvbHVtbkRhdGEoZGF0YSk7XG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IGEgY29sdW1uIGF0IGEgc3BlY2lmaWMgaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb25cbiAgICAgKiBAcGFyYW0gaXRlbVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge0NvbHVtbn1cbiAgICAgKi9cbiAgICBpbnNlcnRDb2x1bW5BdEluZGV4KGRpcmVjdGlvbjogc3RyaW5nLCBpdGVtOiBDb2x1bW4sIGRhdGE6IENvbHVtbkRhdGEpIHtcbiAgICAgICAgbGV0IGluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKGl0ZW0ucGFyZW50LmNoaWxkcmVuKCksIGl0ZW0pLFxuICAgICAgICAgICAgY29sdW1uID0gbmV3IENvbHVtbihpdGVtLnBhcmVudCwgaXRlbS5wYXJlbnQuc3RhZ2UpO1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vdmVBcnJheUl0ZW1JbnRvQXJyYXkoY29sdW1uLCBpdGVtLnBhcmVudC5jaGlsZHJlbiwgaW5kZXgpO1xuICAgICAgICBjb2x1bW4udXBkYXRlQ29sdW1uRGF0YShkYXRhKTtcblxuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgY29sdW1uIGRhdGEgdG8gcmVmbGVjdCB0aGUgY29ycmVjdCB3aWR0aFxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICB1cGRhdGVDb2x1bW5EYXRhKGRhdGE6IENvbHVtbkRhdGEpOiB2b2lkIHtcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIGlmIChkYXRhLndpZHRoKSB7XG4gICAgICAgICAgICBsZXQgY29sdW1uRGVmID0gQ29uZmlnLmdldENvbHVtbkRlZmluaXRpb25CeUJyZWFrcG9pbnQoZGF0YS53aWR0aCk7XG4gICAgICAgICAgICBpZiAoY29sdW1uRGVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uKGNvbHVtbkRlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbihDb25maWcuZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5Q2xhc3NOYW1lKGRhdGEuY2xhc3NOYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YWdlLnN0b3JlLnVwZGF0ZSh0aGlzLmlkLCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgc29ydCBzdGFydGluZyBvbiBjb2x1bW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIG9uU29ydFN0YXJ0KGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKSB7XG4gICAgICAgIC8vIENvcHkgb3ZlciB0aGUgY29sdW1uIGNsYXNzIGZvciB0aGUgd2lkdGhcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5wbGFjZWhvbGRlcikuYWRkQ2xhc3ModGhpcy53aWR0aENsYXNzZXMoKSk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLm9uU29ydFN0YXJ0KGV2ZW50LCBwYXJhbXMpO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb2x1bW5EYXRhIGV4dGVuZHMgRGF0YU9iamVjdCB7XG4gICAgd2lkdGg/OiBudW1iZXIsXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nXG59Il19
