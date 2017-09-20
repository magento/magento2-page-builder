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

        /**
         * Abstract structural constructor
         *
         * @param parent
         * @param stage
         */
        function Column(parent, stage) {
            _classCallCheck(this, Column);

            var _this = _possibleConstructorReturn(this, (Column.__proto__ || Object.getPrototypeOf(Column)).call(this, parent, stage));

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi50cyJdLCJuYW1lcyI6WyJDb2x1bW4iLCJwYXJlbnQiLCJzdGFnZSIsInRlbXBsYXRlIiwiY29sdW1uRGVmaW5pdGlvbiIsImtvIiwib2JzZXJ2YWJsZSIsImdldEluaXRDb25maWciLCJ3aWR0aENsYXNzZXMiLCJjb21wdXRlZCIsInNlcmlhbGl6ZWRXaWR0aCIsIm9wdGlvbnMiLCJwdXNoIiwiZGF0YSIsImNvbHVtbiIsImFkZENoaWxkIiwidXBkYXRlQ29sdW1uRGF0YSIsImRpcmVjdGlvbiIsIml0ZW0iLCJpbmRleCIsInV0aWxzIiwiYXJyYXlJbmRleE9mIiwiY2hpbGRyZW4iLCJ3aWR0aCIsImNvbHVtbkRlZiIsImdldENvbHVtbkRlZmluaXRpb25CeUJyZWFrcG9pbnQiLCJjbGFzc05hbWUiLCJnZXRDb2x1bW5EZWZpbml0aW9uQnlDbGFzc05hbWUiLCJldmVudCIsInBhcmFtcyIsImpRdWVyeSIsInBsYWNlaG9sZGVyIiwiYWRkQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBZU1BLE0sV0FBQUEsTTs7O0FBV0Y7Ozs7OztBQU1BLHdCQUFZQyxNQUFaLEVBQTJDQyxLQUEzQyxFQUFnRTtBQUFBOztBQUFBLHdIQUN0REQsTUFEc0QsRUFDOUNDLEtBRDhDOztBQWhCaEUsa0JBQUFDLFFBQUEsR0FBbUIsc0RBQW5CO0FBRUEsa0JBQUFDLGdCQUFBLEdBQStDQyxHQUFHQyxVQUFILENBQWMsaUJBQU9DLGFBQVAsQ0FBcUIsb0JBQXJCLEVBQTJDLENBQTNDLENBQWQsQ0FBL0M7QUFDQSxrQkFBQUMsWUFBQSxHQUF5Q0gsR0FBR0ksUUFBSCxDQUFZLFlBQUE7QUFDakQsdUJBQU8sS0FBS0wsZ0JBQUwsR0FBd0IsV0FBeEIsQ0FBUDtBQUNILGFBRndDLFFBQXpDO0FBR0Esa0JBQUFNLGVBQUEsR0FBNENMLEdBQUdJLFFBQUgsQ0FBWSxZQUFBO0FBQ3BELHVCQUFPLEtBQUtMLGdCQUFMLEdBQXdCLFlBQXhCLElBQXdDLEdBQS9DO0FBQ0gsYUFGMkMsUUFBNUM7QUFhSSxrQkFBS08sT0FBTCxDQUFhQyxJQUFiLENBQ0ksMEJBQWlCLFFBQWpCLEVBQTJCLFVBQTNCLEVBQXVDLFlBQXZDLEVBQXFELEtBQXJELEVBQTRELENBQUMsWUFBRCxDQUE1RCxFQUE0RSxFQUE1RSxDQURKO0FBSDREO0FBTS9EO0FBRUQ7Ozs7Ozs7Ozs7c0NBTVVDLEksRUFBYTtBQUNuQixvQkFBSUMsU0FBUyxJQUFJZCxNQUFKLENBQVcsSUFBWCxFQUFpQixLQUFLRSxLQUF0QixDQUFiO0FBQ0EscUJBQUthLFFBQUwsQ0FBY0QsTUFBZDtBQUNBQSx1QkFBT0UsZ0JBQVAsQ0FBd0JILElBQXhCO0FBQ0EsdUJBQU9DLE1BQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztnREFRb0JHLFMsRUFBbUJDLEksRUFBY0wsSSxFQUFZO0FBQzdELG9CQUFJTSxRQUFRZCxHQUFHZSxLQUFILENBQVNDLFlBQVQsQ0FBc0JILEtBQUtqQixNQUFMLENBQVlxQixRQUFaLEVBQXRCLEVBQThDSixJQUE5QyxDQUFaO0FBQUEsb0JBQ0lKLFNBQVMsSUFBSWQsTUFBSixDQUFXa0IsS0FBS2pCLE1BQWhCLEVBQXdCaUIsS0FBS2pCLE1BQUwsQ0FBWUMsS0FBcEMsQ0FEYjtBQUdBLG9CQUFJZSxhQUFhLE9BQWpCLEVBQTBCO0FBQ3RCLHNCQUFFRSxLQUFGO0FBQ0g7QUFFRCxtREFBdUJMLE1BQXZCLEVBQStCSSxLQUFLakIsTUFBTCxDQUFZcUIsUUFBM0MsRUFBcURILEtBQXJEO0FBQ0FMLHVCQUFPRSxnQkFBUCxDQUF3QkgsSUFBeEI7QUFFQSx1QkFBT0MsTUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7OzZDQUtpQkQsSSxFQUFnQjtBQUM3QkEsdUJBQU9BLFFBQVEsRUFBZjtBQUNBLG9CQUFJQSxLQUFLVSxLQUFULEVBQWdCO0FBQ1osd0JBQUlDLFlBQVksaUJBQU9DLCtCQUFQLENBQXVDWixLQUFLVSxLQUE1QyxDQUFoQjtBQUNBLHdCQUFJQyxTQUFKLEVBQWU7QUFDWCw2QkFBS3BCLGdCQUFMLENBQXNCb0IsU0FBdEI7QUFDSDtBQUNKLGlCQUxELE1BS08sSUFBSVgsS0FBS2EsU0FBVCxFQUFvQjtBQUN2Qix5QkFBS3RCLGdCQUFMLENBQXNCLGlCQUFPdUIsOEJBQVAsQ0FBc0NkLEtBQUthLFNBQTNDLENBQXRCO0FBQ0g7QUFFRCxxQkFBS2IsSUFBTCxDQUFVQSxJQUFWO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozt3Q0FPWWUsSyxFQUFjQyxNLEVBQWtCO0FBQ3hDO0FBQ0FDLHVCQUFPRCxPQUFPRSxXQUFkLEVBQTJCQyxRQUEzQixDQUFvQyxLQUFLeEIsWUFBTCxFQUFwQztBQUVBLG1JQUF5Qm9CLEtBQXpCLEVBQWdDQyxNQUFoQztBQUNIIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QnO1xuaW1wb3J0IHsgQ29sdW1uSW50ZXJmYWNlIH0gZnJvbSAnLi9jb2x1bW4uZCc7XG5pbXBvcnQgQ29uZmlnICBmcm9tIFwiLi4vLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBtb3ZlQXJyYXlJdGVtSW50b0FycmF5IH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2FycmF5XCI7XG5pbXBvcnQgeyBTb3J0UGFyYW1zIH0gZnJvbSBcIi4vZWRpdGFibGUtYXJlYVwiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb25cIjtcbmltcG9ydCB7IE9wdGlvbkludGVyZmFjZSB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uLmRcIjtcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4vZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vc3RhZ2UuZCc7XG5cbi8qKlxuICogQ29sdW1uIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBDb2x1bW4gZXh0ZW5kcyBBYnN0cmFjdFN0cnVjdHVyYWwgaW1wbGVtZW50cyBDb2x1bW5JbnRlcmZhY2Uge1xuICAgIHRlbXBsYXRlOiBzdHJpbmcgPSAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jb2x1bW4uaHRtbCc7XG5cbiAgICBjb2x1bW5EZWZpbml0aW9uOiBLbm9ja291dE9ic2VydmFibGU8b2JqZWN0PiA9IGtvLm9ic2VydmFibGUoQ29uZmlnLmdldEluaXRDb25maWcoJ2NvbHVtbl9kZWZpbml0aW9ucycpWzBdKTtcbiAgICB3aWR0aENsYXNzZXM6IEtub2Nrb3V0Q29tcHV0ZWQ8c3RyaW5nPiA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW5EZWZpbml0aW9uKClbJ2NsYXNzTmFtZSddO1xuICAgIH0sIHRoaXMpO1xuICAgIHNlcmlhbGl6ZWRXaWR0aDogS25vY2tvdXRDb21wdXRlZDxudW1iZXI+ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW5EZWZpbml0aW9uKClbJ2JyZWFrcG9pbnQnXSAqIDEwMDtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIEFic3RyYWN0IHN0cnVjdHVyYWwgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IEVkaXRhYmxlQXJlYUludGVyZmFjZSwgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlKSB7XG4gICAgICAgIHN1cGVyKHBhcmVudCwgc3RhZ2UpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5vcHRpb25zLnB1c2goXG4gICAgICAgICAgICBuZXcgT3B0aW9uKHRoaXMsICdjb2x1bW4nLCAnPGk+7pi6PC9pPicsICdBZGQgQ29sdW1uJywgZmFsc2UsIFsnYWRkLWNvbHVtbiddLCAxMClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb2x1bW4gdG8gc2VsZlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7Q29sdW1ufVxuICAgICAqL1xuICAgIGFkZENvbHVtbihkYXRhPzogb2JqZWN0KTogQ29sdW1uSW50ZXJmYWNlIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IG5ldyBDb2x1bW4odGhpcywgdGhpcy5zdGFnZSk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoY29sdW1uKTtcbiAgICAgICAgY29sdW1uLnVwZGF0ZUNvbHVtbkRhdGEoZGF0YSk7XG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IGEgY29sdW1uIGF0IGEgc3BlY2lmaWMgaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb25cbiAgICAgKiBAcGFyYW0gaXRlbVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge0NvbHVtbn1cbiAgICAgKi9cbiAgICBpbnNlcnRDb2x1bW5BdEluZGV4KGRpcmVjdGlvbjogc3RyaW5nLCBpdGVtOiBDb2x1bW4sIGRhdGE6IG9iamVjdCkge1xuICAgICAgICBsZXQgaW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YoaXRlbS5wYXJlbnQuY2hpbGRyZW4oKSwgaXRlbSksXG4gICAgICAgICAgICBjb2x1bW4gPSBuZXcgQ29sdW1uKGl0ZW0ucGFyZW50LCBpdGVtLnBhcmVudC5zdGFnZSk7XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PSAncmlnaHQnKSB7XG4gICAgICAgICAgICArK2luZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbW92ZUFycmF5SXRlbUludG9BcnJheShjb2x1bW4sIGl0ZW0ucGFyZW50LmNoaWxkcmVuLCBpbmRleCk7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuXG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBjb2x1bW4gZGF0YSB0byByZWZsZWN0IHRoZSBjb3JyZWN0IHdpZHRoXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIHVwZGF0ZUNvbHVtbkRhdGEoZGF0YTogQ29sdW1uRGF0YSk6IHZvaWQge1xuICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgaWYgKGRhdGEud2lkdGgpIHtcbiAgICAgICAgICAgIGxldCBjb2x1bW5EZWYgPSBDb25maWcuZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5QnJlYWtwb2ludChkYXRhLndpZHRoKTtcbiAgICAgICAgICAgIGlmIChjb2x1bW5EZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbkRlZmluaXRpb24oY29sdW1uRGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uKENvbmZpZy5nZXRDb2x1bW5EZWZpbml0aW9uQnlDbGFzc05hbWUoZGF0YS5jbGFzc05hbWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGF0YShkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgc29ydCBzdGFydGluZyBvbiBjb2x1bW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIG9uU29ydFN0YXJ0KGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKSB7XG4gICAgICAgIC8vIENvcHkgb3ZlciB0aGUgY29sdW1uIGNsYXNzIGZvciB0aGUgd2lkdGhcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5wbGFjZWhvbGRlcikuYWRkQ2xhc3ModGhpcy53aWR0aENsYXNzZXMoKSk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLm9uU29ydFN0YXJ0KGV2ZW50LCBwYXJhbXMpO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIENvbHVtbkRhdGEge1xuICAgIHdpZHRoPzogbnVtYmVyLFxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xufSJdfQ==
