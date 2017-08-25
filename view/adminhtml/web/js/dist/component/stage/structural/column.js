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

    var _get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);

            if (parent === null) {
                return undefined;
            } else {
                return get(parent, property, receiver);
            }
        } else if ("value" in desc) {
            return desc.value;
        } else {
            var getter = desc.get;

            if (getter === undefined) {
                return undefined;
            }

            return getter.call(receiver);
        }
    };

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

        function Column() {
            _classCallCheck(this, Column);

            var _this = _possibleConstructorReturn(this, (Column.__proto__ || Object.getPrototypeOf(Column)).apply(this, arguments));

            _this.template = 'Gene_BlueFoot/component/stage/structural/column.html';
            // @todo determine how to merge with super
            _this.options = [new _option.Option(_this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10)];
            _this.columnDefinition = ko.observable(_config2.default.getInitConfig('column_definitions')[0]);
            _this.widthClasses = ko.computed(function () {
                return this.columnDefinition()['className'];
            }, _this);
            _this.serializedWidth = ko.computed(function () {
                return this.columnDefinition()['breakpoint'] * 100;
            }, _this);
            return _this;
        }
        /**
         * Add a column to self
         *
         * @param data
         * @returns {Column}
         */


        _createClass(Column, [{
            key: "addColumn",
            value: function addColumn(data) {
                var column = new Column(this, this.stage);
                this.addChild(column);
                column.updateColumnData(data);
                return column;
            }
            /**
             * Insert a column at a specific instance
             *
             * @param direction
             * @param item
             * @param data
             * @returns {Column}
             */

        }, {
            key: "insertColumnAtIndex",
            value: function insertColumnAtIndex(direction, item, data) {
                var index = ko.utils.arrayIndexOf(item.parent.children(), item),
                    column = new Column(item.parent, item.parent.stage);
                if (direction == 'right') {
                    ++index;
                }
                (0, _array.moveArrayItemIntoArray)(column, item.parent.children, index);
                column.updateColumnData(data);
                return column;
            }
            /**
             * Update the column data to reflect the correct width
             *
             * @param data
             */

        }, {
            key: "updateColumnData",
            value: function updateColumnData(data) {
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
            }
            /**
             * Handle sort starting on column
             *
             * @param event
             * @param params
             * @returns {any}
             */

        }, {
            key: "onSortStart",
            value: function onSortStart(event, params) {
                // Copy over the column class for the width
                jQuery(params.placeholder).addClass(this.widthClasses());
                return _get(Column.prototype.__proto__ || Object.getPrototypeOf(Column.prototype), "onSortStart", this).call(this, event, params);
            }
        }]);

        return Column;
    }(_abstract.AbstractStructural);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jb2x1bW4udHMiLCJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jb2x1bW4uanMiXSwibmFtZXMiOlsiQ29sdW1uIiwiYXJndW1lbnRzIiwidGVtcGxhdGUiLCJvcHRpb25zIiwiY29sdW1uRGVmaW5pdGlvbiIsImtvIiwib2JzZXJ2YWJsZSIsImdldEluaXRDb25maWciLCJ3aWR0aENsYXNzZXMiLCJjb21wdXRlZCIsInNlcmlhbGl6ZWRXaWR0aCIsImRhdGEiLCJjb2x1bW4iLCJzdGFnZSIsImFkZENoaWxkIiwidXBkYXRlQ29sdW1uRGF0YSIsImRpcmVjdGlvbiIsIml0ZW0iLCJpbmRleCIsInV0aWxzIiwiYXJyYXlJbmRleE9mIiwicGFyZW50IiwiY2hpbGRyZW4iLCJ3aWR0aCIsImNvbHVtbkRlZiIsImdldENvbHVtbkRlZmluaXRpb25CeUJyZWFrcG9pbnQiLCJjbGFzc05hbWUiLCJnZXRDb2x1bW5EZWZpbml0aW9uQnlDbGFzc05hbWUiLCJldmVudCIsInBhcmFtcyIsImpRdWVyeSIsInBsYWNlaG9sZGVyIiwiYWRkQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBYU1BLE0sV0FBQUEsTTs7O0FBQU4sMEJBQUE7QUFBQTs7QUFBQSx5SENGaUJDLFNERWpCOztBQUNJLGtCQUFBQyxRQUFBLEdBQW1CLHNEQUFuQjtBQUVBO0FBQ0Esa0JBQUFDLE9BQUEsR0FBa0MsQ0FDOUIsMEJBQWlCLFFBQWpCLEVBQTJCLFVBQTNCLEVBQXVDLFlBQXZDLEVBQXFELEtBQXJELEVBQTRELENBQUMsWUFBRCxDQUE1RCxFQUE0RSxFQUE1RSxDQUQ4QixDQUFsQztBQUlBLGtCQUFBQyxnQkFBQSxHQUErQ0MsR0FBR0MsVUFBSCxDQUFjLGlCQUFPQyxhQUFQLENBQXFCLG9CQUFyQixFQUEyQyxDQUEzQyxDQUFkLENBQS9DO0FBQ0Esa0JBQUFDLFlBQUEsR0FBeUNILEdBQUdJLFFBQUgsQ0FBWSxZQUFBO0FBQ2pELHVCQUFPLEtBQUtMLGdCQUFMLEdBQXdCLFdBQXhCLENBQVA7QUFDSCxhQUZ3QyxRQUF6QztBQUdBLGtCQUFBTSxlQUFBLEdBQTRDTCxHQUFHSSxRQUFILENBQVksWUFBQTtBQUNwRCx1QkFBTyxLQUFLTCxnQkFBTCxHQUF3QixZQUF4QixJQUF3QyxHQUEvQztBQUNILGFBRjJDLFFBQTVDO0FBWko7QUFtRkM7QUFuRUc7Ozs7Ozs7Ozs7c0NBTVVPLEksRUFBYTtBQUNuQixvQkFBSUMsU0FBUyxJQUFJWixNQUFKLENBQVcsSUFBWCxFQUFpQixLQUFLYSxLQUF0QixDQUFiO0FBQ0EscUJBQUtDLFFBQUwsQ0FBY0YsTUFBZDtBQUNBQSx1QkFBT0csZ0JBQVAsQ0FBd0JKLElBQXhCO0FBQ0EsdUJBQU9DLE1BQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztnREFRb0JJLFMsRUFBbUJDLEksRUFBY04sSSxFQUFZO0FBQzdELG9CQUFJTyxRQUFRYixHQUFHYyxLQUFILENBQVNDLFlBQVQsQ0FBc0JILEtBQUtJLE1BQUwsQ0FBWUMsUUFBWixFQUF0QixFQUE4Q0wsSUFBOUMsQ0FBWjtBQUFBLG9CQUNJTCxTQUFTLElBQUlaLE1BQUosQ0FBV2lCLEtBQUtJLE1BQWhCLEVBQXdCSixLQUFLSSxNQUFMLENBQVlSLEtBQXBDLENBRGI7QUFHQSxvQkFBSUcsYUFBYSxPQUFqQixFQUEwQjtBQUN0QixzQkFBRUUsS0FBRjtBQUNIO0FBRUQsbURBQXVCTixNQUF2QixFQUErQkssS0FBS0ksTUFBTCxDQUFZQyxRQUEzQyxFQUFxREosS0FBckQ7QUFDQU4sdUJBQU9HLGdCQUFQLENBQXdCSixJQUF4QjtBQUVBLHVCQUFPQyxNQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7NkNBS2lCRCxJLEVBQWdCO0FBQzdCQSx1QkFBT0EsUUFBUSxFQUFmO0FBQ0Esb0JBQUlBLEtBQUtZLEtBQVQsRUFBZ0I7QUFDWix3QkFBSUMsWUFBWSxpQkFBT0MsK0JBQVAsQ0FBdUNkLEtBQUtZLEtBQTVDLENBQWhCO0FBQ0Esd0JBQUlDLFNBQUosRUFBZTtBQUNYLDZCQUFLcEIsZ0JBQUwsQ0FBc0JvQixTQUF0QjtBQUNIO0FBQ0osaUJBTEQsTUFLTyxJQUFJYixLQUFLZSxTQUFULEVBQW9CO0FBQ3ZCLHlCQUFLdEIsZ0JBQUwsQ0FBc0IsaUJBQU91Qiw4QkFBUCxDQUFzQ2hCLEtBQUtlLFNBQTNDLENBQXRCO0FBQ0g7QUFFRCxxQkFBS2YsSUFBTCxDQUFVQSxJQUFWO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozt3Q0FPWWlCLEssRUFBY0MsTSxFQUFrQjtBQUN4QztBQUNBQyx1QkFBT0QsT0FBT0UsV0FBZCxFQUEyQkMsUUFBM0IsQ0FBb0MsS0FBS3hCLFlBQUwsRUFBcEM7QUFFQSxtSUFBeUJvQixLQUF6QixFQUFnQ0MsTUFBaEM7QUFDSCIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jb2x1bW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYnN0cmFjdFN0cnVjdHVyYWwgfSBmcm9tICcuL2Fic3RyYWN0JztcbmltcG9ydCB7IENvbHVtbkludGVyZmFjZSB9IGZyb20gJy4vY29sdW1uLmQnO1xuaW1wb3J0IENvbmZpZyAgZnJvbSBcIi4uLy4uL2NvbmZpZ1wiO1xuaW1wb3J0IHsgbW92ZUFycmF5SXRlbUludG9BcnJheSB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9hcnJheVwiO1xuaW1wb3J0IHsgU29ydFBhcmFtcyB9IGZyb20gXCIuL2VkaXRhYmxlLWFyZWFcIjtcbmltcG9ydCB7IE9wdGlvbiB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uXCI7XG5pbXBvcnQgeyBPcHRpb25JbnRlcmZhY2UgfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvbi5kXCI7XG5cbi8qKlxuICogQ29sdW1uIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBDb2x1bW4gZXh0ZW5kcyBBYnN0cmFjdFN0cnVjdHVyYWwgaW1wbGVtZW50cyBDb2x1bW5JbnRlcmZhY2Uge1xuICAgIHRlbXBsYXRlOiBzdHJpbmcgPSAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jb2x1bW4uaHRtbCc7XG5cbiAgICAvLyBAdG9kbyBkZXRlcm1pbmUgaG93IHRvIG1lcmdlIHdpdGggc3VwZXJcbiAgICBvcHRpb25zOiBBcnJheTxPcHRpb25JbnRlcmZhY2U+ID0gW1xuICAgICAgICBuZXcgT3B0aW9uKHRoaXMsICdjb2x1bW4nLCAnPGk+7pi6PC9pPicsICdBZGQgQ29sdW1uJywgZmFsc2UsIFsnYWRkLWNvbHVtbiddLCAxMCksXG4gICAgXTtcblxuICAgIGNvbHVtbkRlZmluaXRpb246IEtub2Nrb3V0T2JzZXJ2YWJsZTxvYmplY3Q+ID0ga28ub2JzZXJ2YWJsZShDb25maWcuZ2V0SW5pdENvbmZpZygnY29sdW1uX2RlZmluaXRpb25zJylbMF0pO1xuICAgIHdpZHRoQ2xhc3NlczogS25vY2tvdXRDb21wdXRlZDxzdHJpbmc+ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbkRlZmluaXRpb24oKVsnY2xhc3NOYW1lJ107XG4gICAgfSwgdGhpcyk7XG4gICAgc2VyaWFsaXplZFdpZHRoOiBLbm9ja291dENvbXB1dGVkPG51bWJlcj4gPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbkRlZmluaXRpb24oKVsnYnJlYWtwb2ludCddICogMTAwO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY29sdW1uIHRvIHNlbGZcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge0NvbHVtbn1cbiAgICAgKi9cbiAgICBhZGRDb2x1bW4oZGF0YT86IG9iamVjdCk6IENvbHVtbkludGVyZmFjZSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBuZXcgQ29sdW1uKHRoaXMsIHRoaXMuc3RhZ2UpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGNvbHVtbik7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluc2VydCBhIGNvbHVtbiBhdCBhIHNwZWNpZmljIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uXG4gICAgICogQHBhcmFtIGl0ZW1cbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtDb2x1bW59XG4gICAgICovXG4gICAgaW5zZXJ0Q29sdW1uQXRJbmRleChkaXJlY3Rpb246IHN0cmluZywgaXRlbTogQ29sdW1uLCBkYXRhOiBvYmplY3QpIHtcbiAgICAgICAgbGV0IGluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKGl0ZW0ucGFyZW50LmNoaWxkcmVuKCksIGl0ZW0pLFxuICAgICAgICAgICAgY29sdW1uID0gbmV3IENvbHVtbihpdGVtLnBhcmVudCwgaXRlbS5wYXJlbnQuc3RhZ2UpO1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vdmVBcnJheUl0ZW1JbnRvQXJyYXkoY29sdW1uLCBpdGVtLnBhcmVudC5jaGlsZHJlbiwgaW5kZXgpO1xuICAgICAgICBjb2x1bW4udXBkYXRlQ29sdW1uRGF0YShkYXRhKTtcblxuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgY29sdW1uIGRhdGEgdG8gcmVmbGVjdCB0aGUgY29ycmVjdCB3aWR0aFxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICB1cGRhdGVDb2x1bW5EYXRhKGRhdGE6IENvbHVtbkRhdGEpOiB2b2lkIHtcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIGlmIChkYXRhLndpZHRoKSB7XG4gICAgICAgICAgICBsZXQgY29sdW1uRGVmID0gQ29uZmlnLmdldENvbHVtbkRlZmluaXRpb25CeUJyZWFrcG9pbnQoZGF0YS53aWR0aCk7XG4gICAgICAgICAgICBpZiAoY29sdW1uRGVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uKGNvbHVtbkRlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbihDb25maWcuZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5Q2xhc3NOYW1lKGRhdGEuY2xhc3NOYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRhdGEoZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHNvcnQgc3RhcnRpbmcgb24gY29sdW1uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBvblNvcnRTdGFydChldmVudDogRXZlbnQsIHBhcmFtczogU29ydFBhcmFtcykge1xuICAgICAgICAvLyBDb3B5IG92ZXIgdGhlIGNvbHVtbiBjbGFzcyBmb3IgdGhlIHdpZHRoXG4gICAgICAgIGpRdWVyeShwYXJhbXMucGxhY2Vob2xkZXIpLmFkZENsYXNzKHRoaXMud2lkdGhDbGFzc2VzKCkpO1xuXG4gICAgICAgIHJldHVybiBzdXBlci5vblNvcnRTdGFydChldmVudCwgcGFyYW1zKTtcbiAgICB9XG59XG5cbmludGVyZmFjZSBDb2x1bW5EYXRhIHtcbiAgICB3aWR0aD86IG51bWJlcixcbiAgICBjbGFzc05hbWU/OiBzdHJpbmdcbn0iLCJpbXBvcnQgeyBBYnN0cmFjdFN0cnVjdHVyYWwgfSBmcm9tICcuL2Fic3RyYWN0JztcbmltcG9ydCBDb25maWcgZnJvbSBcIi4uLy4uL2NvbmZpZ1wiO1xuaW1wb3J0IHsgbW92ZUFycmF5SXRlbUludG9BcnJheSB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9hcnJheVwiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb25cIjtcbi8qKlxuICogQ29sdW1uIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBDb2x1bW4gZXh0ZW5kcyBBYnN0cmFjdFN0cnVjdHVyYWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvY29sdW1uLmh0bWwnO1xuICAgICAgICAvLyBAdG9kbyBkZXRlcm1pbmUgaG93IHRvIG1lcmdlIHdpdGggc3VwZXJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gW1xuICAgICAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnY29sdW1uJywgJzxpPu6YujwvaT4nLCAnQWRkIENvbHVtbicsIGZhbHNlLCBbJ2FkZC1jb2x1bW4nXSwgMTApLFxuICAgICAgICBdO1xuICAgICAgICB0aGlzLmNvbHVtbkRlZmluaXRpb24gPSBrby5vYnNlcnZhYmxlKENvbmZpZy5nZXRJbml0Q29uZmlnKCdjb2x1bW5fZGVmaW5pdGlvbnMnKVswXSk7XG4gICAgICAgIHRoaXMud2lkdGhDbGFzc2VzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmaW5pdGlvbigpWydjbGFzc05hbWUnXTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMuc2VyaWFsaXplZFdpZHRoID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmaW5pdGlvbigpWydicmVha3BvaW50J10gKiAxMDA7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb2x1bW4gdG8gc2VsZlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7Q29sdW1ufVxuICAgICAqL1xuICAgIGFkZENvbHVtbihkYXRhKSB7XG4gICAgICAgIGxldCBjb2x1bW4gPSBuZXcgQ29sdW1uKHRoaXMsIHRoaXMuc3RhZ2UpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGNvbHVtbik7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgYSBjb2x1bW4gYXQgYSBzcGVjaWZpYyBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHBhcmFtIGRpcmVjdGlvblxuICAgICAqIEBwYXJhbSBpdGVtXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7Q29sdW1ufVxuICAgICAqL1xuICAgIGluc2VydENvbHVtbkF0SW5kZXgoZGlyZWN0aW9uLCBpdGVtLCBkYXRhKSB7XG4gICAgICAgIGxldCBpbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihpdGVtLnBhcmVudC5jaGlsZHJlbigpLCBpdGVtKSwgY29sdW1uID0gbmV3IENvbHVtbihpdGVtLnBhcmVudCwgaXRlbS5wYXJlbnQuc3RhZ2UpO1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgbW92ZUFycmF5SXRlbUludG9BcnJheShjb2x1bW4sIGl0ZW0ucGFyZW50LmNoaWxkcmVuLCBpbmRleCk7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIGNvbHVtbiBkYXRhIHRvIHJlZmxlY3QgdGhlIGNvcnJlY3Qgd2lkdGhcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgdXBkYXRlQ29sdW1uRGF0YShkYXRhKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBpZiAoZGF0YS53aWR0aCkge1xuICAgICAgICAgICAgbGV0IGNvbHVtbkRlZiA9IENvbmZpZy5nZXRDb2x1bW5EZWZpbml0aW9uQnlCcmVha3BvaW50KGRhdGEud2lkdGgpO1xuICAgICAgICAgICAgaWYgKGNvbHVtbkRlZikge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbihjb2x1bW5EZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbkRlZmluaXRpb24oQ29uZmlnLmdldENvbHVtbkRlZmluaXRpb25CeUNsYXNzTmFtZShkYXRhLmNsYXNzTmFtZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YShkYXRhKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHNvcnQgc3RhcnRpbmcgb24gY29sdW1uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBvblNvcnRTdGFydChldmVudCwgcGFyYW1zKSB7XG4gICAgICAgIC8vIENvcHkgb3ZlciB0aGUgY29sdW1uIGNsYXNzIGZvciB0aGUgd2lkdGhcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5wbGFjZWhvbGRlcikuYWRkQ2xhc3ModGhpcy53aWR0aENsYXNzZXMoKSk7XG4gICAgICAgIHJldHVybiBzdXBlci5vblNvcnRTdGFydChldmVudCwgcGFyYW1zKTtcbiAgICB9XG59XG4iXX0=
