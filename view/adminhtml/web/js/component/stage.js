define(['exports', './stage/structural/editable-area', './stage/structural/row', 'underscore'], function (exports, _editableArea, _row, _underscore) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _editableArea2 = _interopRequireDefault(_editableArea);

    var _row2 = _interopRequireDefault(_row);

    var _ = _interopRequireWildcard(_underscore);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

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

    var Stage = function (_EditableArea) {
        _inherits(Stage, _EditableArea);

        /**
         * Stage constructor
         *
         * @param parent
         * @param stageContent
         */
        function Stage(parent, stageContent) {
            _classCallCheck(this, Stage);

            var _this = _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this));

            _this.active = true;
            _this.serializeRole = 'stage';
            _this.setChildren(stageContent);
            _this.parent = parent;
            _this.showBorders = parent.showBorder;
            _this.userSelect = parent.userSelect;
            _this.loading = parent.loading;
            _.bindAll(_this, 'onSortingStart', 'onSortingStop');
            _this.on('sortingStart', _this.onSortingStart);
            _this.on('sortingStop', _this.onSortingStop);
            return _this;
        }

        _createClass(Stage, [{
            key: 'build',
            value: function build() {
                // @todo
                this.ready();
            }
        }, {
            key: 'ready',
            value: function ready() {
                this.emit('stageReady');
                this.children.valueHasMutated();
                this.loading(false);
            }
        }, {
            key: 'addRow',
            value: function addRow(self, data) {
                var row = new _row2.default(self, self);
                row.data(data);
                this.addChild(row);
                return row;
            }
        }, {
            key: 'openTemplateManager',
            value: function openTemplateManager() {
                // @todo
            }
        }, {
            key: 'addComponent',
            value: function addComponent() {}
            // @todo

            /**
             * Event handler for any element being sorted in the stage
             */

        }, {
            key: 'onSortingStart',
            value: function onSortingStart() {
                this.showBorders(true);
            }
        }, {
            key: 'onSortingStop',
            value: function onSortingStop() {
                this.showBorders(false);
            }
        }]);

        return Stage;
    }(_editableArea2.default);

    exports.default = Stage;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS50cyJdLCJuYW1lcyI6WyJfIiwiU3RhZ2UiLCJwYXJlbnQiLCJzdGFnZUNvbnRlbnQiLCJhY3RpdmUiLCJzZXJpYWxpemVSb2xlIiwic2V0Q2hpbGRyZW4iLCJzaG93Qm9yZGVycyIsInNob3dCb3JkZXIiLCJ1c2VyU2VsZWN0IiwibG9hZGluZyIsImJpbmRBbGwiLCJvbiIsIm9uU29ydGluZ1N0YXJ0Iiwib25Tb3J0aW5nU3RvcCIsInJlYWR5IiwiZW1pdCIsImNoaWxkcmVuIiwidmFsdWVIYXNNdXRhdGVkIiwic2VsZiIsImRhdGEiLCJyb3ciLCJhZGRDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUFJWUEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU9FQyxLOzs7QUFTVjs7Ozs7O0FBTUEsdUJBQVlDLE1BQVosRUFBeUJDLFlBQXpCLEVBQW1GO0FBQUE7O0FBQUE7O0FBWm5GLGtCQUFBQyxNQUFBLEdBQWtCLElBQWxCO0FBSUEsa0JBQUFDLGFBQUEsR0FBd0IsT0FBeEI7QUFVSSxrQkFBS0MsV0FBTCxDQUFpQkgsWUFBakI7QUFDQSxrQkFBS0QsTUFBTCxHQUFjQSxNQUFkO0FBRUEsa0JBQUtLLFdBQUwsR0FBbUJMLE9BQU9NLFVBQTFCO0FBQ0Esa0JBQUtDLFVBQUwsR0FBa0JQLE9BQU9PLFVBQXpCO0FBQ0Esa0JBQUtDLE9BQUwsR0FBZVIsT0FBT1EsT0FBdEI7QUFFQVYsY0FBRVcsT0FBRixRQUVJLGdCQUZKLEVBR0ksZUFISjtBQU1BLGtCQUFLQyxFQUFMLENBQVEsY0FBUixFQUF3QixNQUFLQyxjQUE3QjtBQUNBLGtCQUFLRCxFQUFMLENBQVEsYUFBUixFQUF1QixNQUFLRSxhQUE1QjtBQWhCK0U7QUFpQmxGOzs7O29DQUVJO0FBQ0Q7QUFDQSxxQkFBS0MsS0FBTDtBQUNIOzs7b0NBS0k7QUFDRCxxQkFBS0MsSUFBTCxDQUFVLFlBQVY7QUFDQSxxQkFBS0MsUUFBTCxDQUFjQyxlQUFkO0FBQ0EscUJBQUtSLE9BQUwsQ0FBYSxLQUFiO0FBQ0g7OzttQ0FTTVMsSSxFQUFzQkMsSSxFQUFhO0FBQ3RDLG9CQUFJQyxNQUFNLGtCQUFRRixJQUFSLEVBQWNBLElBQWQsQ0FBVjtBQUNBRSxvQkFBSUQsSUFBSixDQUFTQSxJQUFUO0FBQ0EscUJBQUtFLFFBQUwsQ0FBY0QsR0FBZDtBQUVBLHVCQUFPQSxHQUFQO0FBQ0g7OztrREFFa0I7QUFDZjtBQUNIOzs7MkNBRVcsQ0FFWDtBQURHOztBQUdKOzs7Ozs7NkNBR2M7QUFDVixxQkFBS2QsV0FBTCxDQUFpQixJQUFqQjtBQUNIOzs7NENBS1k7QUFDVCxxQkFBS0EsV0FBTCxDQUFpQixLQUFqQjtBQUNIOzs7Ozs7c0JBbkZTTixLIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFZGl0YWJsZUFyZWEgZnJvbSAnLi9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuL3N0YWdlLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCBhcyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIH0gZnJvbSAnLi9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0LmQnO1xuaW1wb3J0IFJvdyBmcm9tICcuL3N0YWdlL3N0cnVjdHVyYWwvcm93JztcbmltcG9ydCAqIGFzIF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbi8qKlxuICogU3RhZ2UgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhZ2UgZXh0ZW5kcyBFZGl0YWJsZUFyZWEgaW1wbGVtZW50cyBTdGFnZUludGVyZmFjZSB7XG4gICAgcGFyZW50OiBhbnk7XG4gICAgc3RhZ2U6IFN0YWdlO1xuICAgIGFjdGl2ZTogYm9vbGVhbiA9IHRydWU7XG4gICAgc2hvd0JvcmRlcnM6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICB1c2VyU2VsZWN0OiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgbG9hZGluZzogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIHNlcmlhbGl6ZVJvbGU6IHN0cmluZyA9ICdzdGFnZSc7XG5cbiAgICAvKipcbiAgICAgKiBTdGFnZSBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEBwYXJhbSBzdGFnZUNvbnRlbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGFueSwgc3RhZ2VDb250ZW50OiBLbm9ja291dE9ic2VydmFibGVBcnJheTxTdHJ1Y3R1cmFsSW50ZXJmYWNlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNldENoaWxkcmVuKHN0YWdlQ29udGVudCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXG4gICAgICAgIHRoaXMuc2hvd0JvcmRlcnMgPSBwYXJlbnQuc2hvd0JvcmRlcjtcbiAgICAgICAgdGhpcy51c2VyU2VsZWN0ID0gcGFyZW50LnVzZXJTZWxlY3Q7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHBhcmVudC5sb2FkaW5nO1xuXG4gICAgICAgIF8uYmluZEFsbChcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAnb25Tb3J0aW5nU3RhcnQnLFxuICAgICAgICAgICAgJ29uU29ydGluZ1N0b3AnXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5vbignc29ydGluZ1N0YXJ0JywgdGhpcy5vblNvcnRpbmdTdGFydCk7XG4gICAgICAgIHRoaXMub24oJ3NvcnRpbmdTdG9wJywgdGhpcy5vblNvcnRpbmdTdG9wKTtcbiAgICB9XG5cbiAgICBidWlsZCgpIHtcbiAgICAgICAgLy8gQHRvZG9cbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBzdGFnZSBoYXMgYmVlbiBpbml0aWF0ZWQgZnVsbHkgYW5kIGlzIHJlYWR5XG4gICAgICovXG4gICAgcmVhZHkoKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnc3RhZ2VSZWFkeScpO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICB0aGlzLmxvYWRpbmcoZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHJvdyB0byB0aGUgc3RhZ2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZWxmXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7Um93fVxuICAgICAqL1xuICAgIGFkZFJvdyhzZWxmOiBTdGFnZUludGVyZmFjZSwgZGF0YT86IG9iamVjdCk6IFJvdyB7XG4gICAgICAgIGxldCByb3cgPSBuZXcgUm93KHNlbGYsIHNlbGYpO1xuICAgICAgICByb3cuZGF0YShkYXRhKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChyb3cpO1xuXG4gICAgICAgIHJldHVybiByb3c7XG4gICAgfVxuXG4gICAgb3BlblRlbXBsYXRlTWFuYWdlcigpIHtcbiAgICAgICAgLy8gQHRvZG9cbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoKSB7XG4gICAgICAgIC8vIEB0b2RvXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgYW55IGVsZW1lbnQgYmVpbmcgc29ydGVkIGluIHRoZSBzdGFnZVxuICAgICAqL1xuICAgIG9uU29ydGluZ1N0YXJ0KCkge1xuICAgICAgICB0aGlzLnNob3dCb3JkZXJzKHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gc29ydGluZyBzdG9wc1xuICAgICAqL1xuICAgIG9uU29ydGluZ1N0b3AoKSB7XG4gICAgICAgIHRoaXMuc2hvd0JvcmRlcnMoZmFsc2UpO1xuICAgIH1cbn0iXX0=
