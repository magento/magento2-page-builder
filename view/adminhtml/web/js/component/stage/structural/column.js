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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi50cyIsImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi5qcyJdLCJuYW1lcyI6WyJDb2x1bW4iLCJhcmd1bWVudHMiLCJ0ZW1wbGF0ZSIsIm9wdGlvbnMiLCJjb2x1bW5EZWZpbml0aW9uIiwia28iLCJvYnNlcnZhYmxlIiwiZ2V0SW5pdENvbmZpZyIsIndpZHRoQ2xhc3NlcyIsImNvbXB1dGVkIiwic2VyaWFsaXplZFdpZHRoIiwiZGF0YSIsImNvbHVtbiIsInN0YWdlIiwiYWRkQ2hpbGQiLCJ1cGRhdGVDb2x1bW5EYXRhIiwiZGlyZWN0aW9uIiwiaXRlbSIsImluZGV4IiwidXRpbHMiLCJhcnJheUluZGV4T2YiLCJwYXJlbnQiLCJjaGlsZHJlbiIsIndpZHRoIiwiY29sdW1uRGVmIiwiZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5QnJlYWtwb2ludCIsImNsYXNzTmFtZSIsImdldENvbHVtbkRlZmluaXRpb25CeUNsYXNzTmFtZSIsImV2ZW50IiwicGFyYW1zIiwialF1ZXJ5IiwicGxhY2Vob2xkZXIiLCJhZGRDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFhTUEsTSxXQUFBQSxNOzs7QUFBTiwwQkFBQTtBQUFBOztBQUFBLHlIQ0ZpQkMsU0RFakI7O0FBQ0ksa0JBQUFDLFFBQUEsR0FBbUIsc0RBQW5CO0FBRUE7QUFDQSxrQkFBQUMsT0FBQSxHQUFrQyxDQUM5QiwwQkFBaUIsUUFBakIsRUFBMkIsVUFBM0IsRUFBdUMsWUFBdkMsRUFBcUQsS0FBckQsRUFBNEQsQ0FBQyxZQUFELENBQTVELEVBQTRFLEVBQTVFLENBRDhCLENBQWxDO0FBSUEsa0JBQUFDLGdCQUFBLEdBQStDQyxHQUFHQyxVQUFILENBQWMsaUJBQU9DLGFBQVAsQ0FBcUIsb0JBQXJCLEVBQTJDLENBQTNDLENBQWQsQ0FBL0M7QUFDQSxrQkFBQUMsWUFBQSxHQUF5Q0gsR0FBR0ksUUFBSCxDQUFZLFlBQUE7QUFDakQsdUJBQU8sS0FBS0wsZ0JBQUwsR0FBd0IsV0FBeEIsQ0FBUDtBQUNILGFBRndDLFFBQXpDO0FBR0Esa0JBQUFNLGVBQUEsR0FBNENMLEdBQUdJLFFBQUgsQ0FBWSxZQUFBO0FBQ3BELHVCQUFPLEtBQUtMLGdCQUFMLEdBQXdCLFlBQXhCLElBQXdDLEdBQS9DO0FBQ0gsYUFGMkMsUUFBNUM7QUFaSjtBQW1GQztBQW5FRzs7Ozs7Ozs7OztzQ0FNVU8sSSxFQUFhO0FBQ25CLG9CQUFJQyxTQUFTLElBQUlaLE1BQUosQ0FBVyxJQUFYLEVBQWlCLEtBQUthLEtBQXRCLENBQWI7QUFDQSxxQkFBS0MsUUFBTCxDQUFjRixNQUFkO0FBQ0FBLHVCQUFPRyxnQkFBUCxDQUF3QkosSUFBeEI7QUFDQSx1QkFBT0MsTUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7O2dEQVFvQkksUyxFQUFtQkMsSSxFQUFjTixJLEVBQVk7QUFDN0Qsb0JBQUlPLFFBQVFiLEdBQUdjLEtBQUgsQ0FBU0MsWUFBVCxDQUFzQkgsS0FBS0ksTUFBTCxDQUFZQyxRQUFaLEVBQXRCLEVBQThDTCxJQUE5QyxDQUFaO0FBQUEsb0JBQ0lMLFNBQVMsSUFBSVosTUFBSixDQUFXaUIsS0FBS0ksTUFBaEIsRUFBd0JKLEtBQUtJLE1BQUwsQ0FBWVIsS0FBcEMsQ0FEYjtBQUdBLG9CQUFJRyxhQUFhLE9BQWpCLEVBQTBCO0FBQ3RCLHNCQUFFRSxLQUFGO0FBQ0g7QUFFRCxtREFBdUJOLE1BQXZCLEVBQStCSyxLQUFLSSxNQUFMLENBQVlDLFFBQTNDLEVBQXFESixLQUFyRDtBQUNBTix1QkFBT0csZ0JBQVAsQ0FBd0JKLElBQXhCO0FBRUEsdUJBQU9DLE1BQVA7QUFDSDtBQUVEOzs7Ozs7Ozs2Q0FLaUJELEksRUFBZ0I7QUFDN0JBLHVCQUFPQSxRQUFRLEVBQWY7QUFDQSxvQkFBSUEsS0FBS1ksS0FBVCxFQUFnQjtBQUNaLHdCQUFJQyxZQUFZLGlCQUFPQywrQkFBUCxDQUF1Q2QsS0FBS1ksS0FBNUMsQ0FBaEI7QUFDQSx3QkFBSUMsU0FBSixFQUFlO0FBQ1gsNkJBQUtwQixnQkFBTCxDQUFzQm9CLFNBQXRCO0FBQ0g7QUFDSixpQkFMRCxNQUtPLElBQUliLEtBQUtlLFNBQVQsRUFBb0I7QUFDdkIseUJBQUt0QixnQkFBTCxDQUFzQixpQkFBT3VCLDhCQUFQLENBQXNDaEIsS0FBS2UsU0FBM0MsQ0FBdEI7QUFDSDtBQUVELHFCQUFLZixJQUFMLENBQVVBLElBQVY7QUFDSDtBQUVEOzs7Ozs7Ozs7O3dDQU9ZaUIsSyxFQUFjQyxNLEVBQWtCO0FBQ3hDO0FBQ0FDLHVCQUFPRCxPQUFPRSxXQUFkLEVBQTJCQyxRQUEzQixDQUFvQyxLQUFLeEIsWUFBTCxFQUFwQztBQUVBLG1JQUF5Qm9CLEtBQXpCLEVBQWdDQyxNQUFoQztBQUNIIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QnO1xuaW1wb3J0IHsgQ29sdW1uSW50ZXJmYWNlIH0gZnJvbSAnLi9jb2x1bW4uZCc7XG5pbXBvcnQgQ29uZmlnICBmcm9tIFwiLi4vLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBtb3ZlQXJyYXlJdGVtSW50b0FycmF5IH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2FycmF5XCI7XG5pbXBvcnQgeyBTb3J0UGFyYW1zIH0gZnJvbSBcIi4vZWRpdGFibGUtYXJlYVwiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb25cIjtcbmltcG9ydCB7IE9wdGlvbkludGVyZmFjZSB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uLmRcIjtcblxuLyoqXG4gKiBDb2x1bW4gY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbHVtbiBleHRlbmRzIEFic3RyYWN0U3RydWN0dXJhbCBpbXBsZW1lbnRzIENvbHVtbkludGVyZmFjZSB7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi5odG1sJztcblxuICAgIC8vIEB0b2RvIGRldGVybWluZSBob3cgdG8gbWVyZ2Ugd2l0aCBzdXBlclxuICAgIG9wdGlvbnM6IEFycmF5PE9wdGlvbkludGVyZmFjZT4gPSBbXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ2NvbHVtbicsICc8aT7umLo8L2k+JywgJ0FkZCBDb2x1bW4nLCBmYWxzZSwgWydhZGQtY29sdW1uJ10sIDEwKSxcbiAgICBdO1xuXG4gICAgY29sdW1uRGVmaW5pdGlvbjogS25vY2tvdXRPYnNlcnZhYmxlPG9iamVjdD4gPSBrby5vYnNlcnZhYmxlKENvbmZpZy5nZXRJbml0Q29uZmlnKCdjb2x1bW5fZGVmaW5pdGlvbnMnKVswXSk7XG4gICAgd2lkdGhDbGFzc2VzOiBLbm9ja291dENvbXB1dGVkPHN0cmluZz4gPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmaW5pdGlvbigpWydjbGFzc05hbWUnXTtcbiAgICB9LCB0aGlzKTtcbiAgICBzZXJpYWxpemVkV2lkdGg6IEtub2Nrb3V0Q29tcHV0ZWQ8bnVtYmVyPiA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmaW5pdGlvbigpWydicmVha3BvaW50J10gKiAxMDA7XG4gICAgfSwgdGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjb2x1bW4gdG8gc2VsZlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7Q29sdW1ufVxuICAgICAqL1xuICAgIGFkZENvbHVtbihkYXRhPzogb2JqZWN0KTogQ29sdW1uSW50ZXJmYWNlIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IG5ldyBDb2x1bW4odGhpcywgdGhpcy5zdGFnZSk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoY29sdW1uKTtcbiAgICAgICAgY29sdW1uLnVwZGF0ZUNvbHVtbkRhdGEoZGF0YSk7XG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IGEgY29sdW1uIGF0IGEgc3BlY2lmaWMgaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb25cbiAgICAgKiBAcGFyYW0gaXRlbVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge0NvbHVtbn1cbiAgICAgKi9cbiAgICBpbnNlcnRDb2x1bW5BdEluZGV4KGRpcmVjdGlvbjogc3RyaW5nLCBpdGVtOiBDb2x1bW4sIGRhdGE6IG9iamVjdCkge1xuICAgICAgICBsZXQgaW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YoaXRlbS5wYXJlbnQuY2hpbGRyZW4oKSwgaXRlbSksXG4gICAgICAgICAgICBjb2x1bW4gPSBuZXcgQ29sdW1uKGl0ZW0ucGFyZW50LCBpdGVtLnBhcmVudC5zdGFnZSk7XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PSAncmlnaHQnKSB7XG4gICAgICAgICAgICArK2luZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgbW92ZUFycmF5SXRlbUludG9BcnJheShjb2x1bW4sIGl0ZW0ucGFyZW50LmNoaWxkcmVuLCBpbmRleCk7XG4gICAgICAgIGNvbHVtbi51cGRhdGVDb2x1bW5EYXRhKGRhdGEpO1xuXG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBjb2x1bW4gZGF0YSB0byByZWZsZWN0IHRoZSBjb3JyZWN0IHdpZHRoXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIHVwZGF0ZUNvbHVtbkRhdGEoZGF0YTogQ29sdW1uRGF0YSk6IHZvaWQge1xuICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgaWYgKGRhdGEud2lkdGgpIHtcbiAgICAgICAgICAgIGxldCBjb2x1bW5EZWYgPSBDb25maWcuZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5QnJlYWtwb2ludChkYXRhLndpZHRoKTtcbiAgICAgICAgICAgIGlmIChjb2x1bW5EZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbkRlZmluaXRpb24oY29sdW1uRGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uKENvbmZpZy5nZXRDb2x1bW5EZWZpbml0aW9uQnlDbGFzc05hbWUoZGF0YS5jbGFzc05hbWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGF0YShkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgc29ydCBzdGFydGluZyBvbiBjb2x1bW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIG9uU29ydFN0YXJ0KGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKSB7XG4gICAgICAgIC8vIENvcHkgb3ZlciB0aGUgY29sdW1uIGNsYXNzIGZvciB0aGUgd2lkdGhcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5wbGFjZWhvbGRlcikuYWRkQ2xhc3ModGhpcy53aWR0aENsYXNzZXMoKSk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLm9uU29ydFN0YXJ0KGV2ZW50LCBwYXJhbXMpO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIENvbHVtbkRhdGEge1xuICAgIHdpZHRoPzogbnVtYmVyLFxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xufSIsImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QnO1xuaW1wb3J0IENvbmZpZyBmcm9tIFwiLi4vLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBtb3ZlQXJyYXlJdGVtSW50b0FycmF5IH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2FycmF5XCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvblwiO1xuLyoqXG4gKiBDb2x1bW4gY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbHVtbiBleHRlbmRzIEFic3RyYWN0U3RydWN0dXJhbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jb2x1bW4uaHRtbCc7XG4gICAgICAgIC8vIEB0b2RvIGRldGVybWluZSBob3cgdG8gbWVyZ2Ugd2l0aCBzdXBlclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBbXG4gICAgICAgICAgICBuZXcgT3B0aW9uKHRoaXMsICdjb2x1bW4nLCAnPGk+7pi6PC9pPicsICdBZGQgQ29sdW1uJywgZmFsc2UsIFsnYWRkLWNvbHVtbiddLCAxMCksXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbiA9IGtvLm9ic2VydmFibGUoQ29uZmlnLmdldEluaXRDb25maWcoJ2NvbHVtbl9kZWZpbml0aW9ucycpWzBdKTtcbiAgICAgICAgdGhpcy53aWR0aENsYXNzZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW5EZWZpbml0aW9uKClbJ2NsYXNzTmFtZSddO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy5zZXJpYWxpemVkV2lkdGggPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW5EZWZpbml0aW9uKClbJ2JyZWFrcG9pbnQnXSAqIDEwMDtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNvbHVtbiB0byBzZWxmXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtDb2x1bW59XG4gICAgICovXG4gICAgYWRkQ29sdW1uKGRhdGEpIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IG5ldyBDb2x1bW4odGhpcywgdGhpcy5zdGFnZSk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoY29sdW1uKTtcbiAgICAgICAgY29sdW1uLnVwZGF0ZUNvbHVtbkRhdGEoZGF0YSk7XG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc2VydCBhIGNvbHVtbiBhdCBhIHNwZWNpZmljIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uXG4gICAgICogQHBhcmFtIGl0ZW1cbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtDb2x1bW59XG4gICAgICovXG4gICAgaW5zZXJ0Q29sdW1uQXRJbmRleChkaXJlY3Rpb24sIGl0ZW0sIGRhdGEpIHtcbiAgICAgICAgbGV0IGluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKGl0ZW0ucGFyZW50LmNoaWxkcmVuKCksIGl0ZW0pLCBjb2x1bW4gPSBuZXcgQ29sdW1uKGl0ZW0ucGFyZW50LCBpdGVtLnBhcmVudC5zdGFnZSk7XG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgfVxuICAgICAgICBtb3ZlQXJyYXlJdGVtSW50b0FycmF5KGNvbHVtbiwgaXRlbS5wYXJlbnQuY2hpbGRyZW4sIGluZGV4KTtcbiAgICAgICAgY29sdW1uLnVwZGF0ZUNvbHVtbkRhdGEoZGF0YSk7XG4gICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgY29sdW1uIGRhdGEgdG8gcmVmbGVjdCB0aGUgY29ycmVjdCB3aWR0aFxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICB1cGRhdGVDb2x1bW5EYXRhKGRhdGEpIHtcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIGlmIChkYXRhLndpZHRoKSB7XG4gICAgICAgICAgICBsZXQgY29sdW1uRGVmID0gQ29uZmlnLmdldENvbHVtbkRlZmluaXRpb25CeUJyZWFrcG9pbnQoZGF0YS53aWR0aCk7XG4gICAgICAgICAgICBpZiAoY29sdW1uRGVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uKGNvbHVtbkRlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGF0YS5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbihDb25maWcuZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5Q2xhc3NOYW1lKGRhdGEuY2xhc3NOYW1lKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhKGRhdGEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgc29ydCBzdGFydGluZyBvbiBjb2x1bW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIG9uU29ydFN0YXJ0KGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgLy8gQ29weSBvdmVyIHRoZSBjb2x1bW4gY2xhc3MgZm9yIHRoZSB3aWR0aFxuICAgICAgICBqUXVlcnkocGFyYW1zLnBsYWNlaG9sZGVyKS5hZGRDbGFzcyh0aGlzLndpZHRoQ2xhc3NlcygpKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLm9uU29ydFN0YXJ0KGV2ZW50LCBwYXJhbXMpO1xuICAgIH1cbn1cbiJdfQ==
