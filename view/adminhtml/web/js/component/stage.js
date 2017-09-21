define(['exports', './stage/structural/editable-area', './stage/structural/row', 'underscore'], function (exports, _editableArea, _row, _underscore) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _editableArea2 = _interopRequireDefault(_editableArea);

    var _row2 = _interopRequireDefault(_row);

    var _underscore2 = _interopRequireDefault(_underscore);

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
            _this.stage = _this;
            _this.parent = parent;
            _this.showBorders = parent.showBorder;
            _this.userSelect = parent.userSelect;
            _this.loading = parent.loading;
            _underscore2.default.bindAll(_this, 'onSortingStart', 'onSortingStop');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS50cyJdLCJuYW1lcyI6WyJTdGFnZSIsInBhcmVudCIsInN0YWdlQ29udGVudCIsImFjdGl2ZSIsInNlcmlhbGl6ZVJvbGUiLCJzZXRDaGlsZHJlbiIsInN0YWdlIiwic2hvd0JvcmRlcnMiLCJzaG93Qm9yZGVyIiwidXNlclNlbGVjdCIsImxvYWRpbmciLCJiaW5kQWxsIiwib24iLCJvblNvcnRpbmdTdGFydCIsIm9uU29ydGluZ1N0b3AiLCJyZWFkeSIsImVtaXQiLCJjaGlsZHJlbiIsInZhbHVlSGFzTXV0YXRlZCIsInNlbGYiLCJkYXRhIiwicm93IiwiYWRkQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFXY0EsSzs7O0FBU1Y7Ozs7OztBQU1BLHVCQUFZQyxNQUFaLEVBQXlCQyxZQUF6QixFQUFtRjtBQUFBOztBQUFBOztBQVpuRixrQkFBQUMsTUFBQSxHQUFrQixJQUFsQjtBQUlBLGtCQUFBQyxhQUFBLEdBQXdCLE9BQXhCO0FBVUksa0JBQUtDLFdBQUwsQ0FBaUJILFlBQWpCO0FBQ0Esa0JBQUtJLEtBQUw7QUFDQSxrQkFBS0wsTUFBTCxHQUFjQSxNQUFkO0FBRUEsa0JBQUtNLFdBQUwsR0FBbUJOLE9BQU9PLFVBQTFCO0FBQ0Esa0JBQUtDLFVBQUwsR0FBa0JSLE9BQU9RLFVBQXpCO0FBQ0Esa0JBQUtDLE9BQUwsR0FBZVQsT0FBT1MsT0FBdEI7QUFFQSxpQ0FBRUMsT0FBRixRQUVJLGdCQUZKLEVBR0ksZUFISjtBQU1BLGtCQUFLQyxFQUFMLENBQVEsY0FBUixFQUF3QixNQUFLQyxjQUE3QjtBQUNBLGtCQUFLRCxFQUFMLENBQVEsYUFBUixFQUF1QixNQUFLRSxhQUE1QjtBQWpCK0U7QUFrQmxGOzs7O29DQUVJO0FBQ0Q7QUFDQSxxQkFBS0MsS0FBTDtBQUNIOzs7b0NBS0k7QUFDRCxxQkFBS0MsSUFBTCxDQUFVLFlBQVY7QUFDQSxxQkFBS0MsUUFBTCxDQUFjQyxlQUFkO0FBQ0EscUJBQUtSLE9BQUwsQ0FBYSxLQUFiO0FBQ0g7OzttQ0FTTVMsSSxFQUFzQkMsSSxFQUFhO0FBQ3RDLG9CQUFJQyxNQUFNLGtCQUFRRixJQUFSLEVBQWNBLElBQWQsQ0FBVjtBQUNBRSxvQkFBSUQsSUFBSixDQUFTQSxJQUFUO0FBQ0EscUJBQUtFLFFBQUwsQ0FBY0QsR0FBZDtBQUVBLHVCQUFPQSxHQUFQO0FBQ0g7OztrREFFa0I7QUFDZjtBQUNIOzs7MkNBRVcsQ0FFWDtBQURHOztBQUdKOzs7Ozs7NkNBR2M7QUFDVixxQkFBS2QsV0FBTCxDQUFpQixJQUFqQjtBQUNIOzs7NENBS1k7QUFDVCxxQkFBS0EsV0FBTCxDQUFpQixLQUFqQjtBQUNIOzs7Ozs7c0JBcEZTUCxLIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFZGl0YWJsZUFyZWEgZnJvbSAnLi9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuL3N0YWdlLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCBhcyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIH0gZnJvbSAnLi9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0LmQnO1xuaW1wb3J0IFJvdyBmcm9tICcuL3N0YWdlL3N0cnVjdHVyYWwvcm93JztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG4vKipcbiAqIFN0YWdlIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWdlIGV4dGVuZHMgRWRpdGFibGVBcmVhIGltcGxlbWVudHMgU3RhZ2VJbnRlcmZhY2Uge1xuICAgIHBhcmVudDogYW55O1xuICAgIHN0YWdlOiBTdGFnZTtcbiAgICBhY3RpdmU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHNob3dCb3JkZXJzOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgdXNlclNlbGVjdDogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIGxvYWRpbmc6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBzZXJpYWxpemVSb2xlOiBzdHJpbmcgPSAnc3RhZ2UnO1xuXG4gICAgLyoqXG4gICAgICogU3RhZ2UgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcGFyYW0gc3RhZ2VDb250ZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBhbnksIHN0YWdlQ29udGVudDogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8U3RydWN0dXJhbEludGVyZmFjZT4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zZXRDaGlsZHJlbihzdGFnZUNvbnRlbnQpO1xuICAgICAgICB0aGlzLnN0YWdlID0gdGhpcztcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICAgICAgdGhpcy5zaG93Qm9yZGVycyA9IHBhcmVudC5zaG93Qm9yZGVyO1xuICAgICAgICB0aGlzLnVzZXJTZWxlY3QgPSBwYXJlbnQudXNlclNlbGVjdDtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gcGFyZW50LmxvYWRpbmc7XG5cbiAgICAgICAgXy5iaW5kQWxsKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICdvblNvcnRpbmdTdGFydCcsXG4gICAgICAgICAgICAnb25Tb3J0aW5nU3RvcCdcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLm9uKCdzb3J0aW5nU3RhcnQnLCB0aGlzLm9uU29ydGluZ1N0YXJ0KTtcbiAgICAgICAgdGhpcy5vbignc29ydGluZ1N0b3AnLCB0aGlzLm9uU29ydGluZ1N0b3ApO1xuICAgIH1cblxuICAgIGJ1aWxkKCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHN0YWdlIGhhcyBiZWVuIGluaXRpYXRlZCBmdWxseSBhbmQgaXMgcmVhZHlcbiAgICAgKi9cbiAgICByZWFkeSgpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzdGFnZVJlYWR5Jyk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4udmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcm93IHRvIHRoZSBzdGFnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHNlbGZcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtSb3d9XG4gICAgICovXG4gICAgYWRkUm93KHNlbGY6IFN0YWdlSW50ZXJmYWNlLCBkYXRhPzogb2JqZWN0KTogUm93IHtcbiAgICAgICAgbGV0IHJvdyA9IG5ldyBSb3coc2VsZiwgc2VsZik7XG4gICAgICAgIHJvdy5kYXRhKGRhdGEpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHJvdyk7XG5cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG5cbiAgICBvcGVuVGVtcGxhdGVNYW5hZ2VyKCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgIH1cblxuICAgIGFkZENvbXBvbmVudCgpIHtcbiAgICAgICAgLy8gQHRvZG9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBhbnkgZWxlbWVudCBiZWluZyBzb3J0ZWQgaW4gdGhlIHN0YWdlXG4gICAgICovXG4gICAgb25Tb3J0aW5nU3RhcnQoKSB7XG4gICAgICAgIHRoaXMuc2hvd0JvcmRlcnModHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBzb3J0aW5nIHN0b3BzXG4gICAgICovXG4gICAgb25Tb3J0aW5nU3RvcCgpIHtcbiAgICAgICAgdGhpcy5zaG93Qm9yZGVycyhmYWxzZSk7XG4gICAgfVxufSJdfQ==
