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
            _this.stage = _this;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS50cyJdLCJuYW1lcyI6WyJfIiwiU3RhZ2UiLCJwYXJlbnQiLCJzdGFnZUNvbnRlbnQiLCJhY3RpdmUiLCJzZXJpYWxpemVSb2xlIiwic2V0Q2hpbGRyZW4iLCJzdGFnZSIsInNob3dCb3JkZXJzIiwic2hvd0JvcmRlciIsInVzZXJTZWxlY3QiLCJsb2FkaW5nIiwiYmluZEFsbCIsIm9uIiwib25Tb3J0aW5nU3RhcnQiLCJvblNvcnRpbmdTdG9wIiwicmVhZHkiLCJlbWl0IiwiY2hpbGRyZW4iLCJ2YWx1ZUhhc011dGF0ZWQiLCJzZWxmIiwiZGF0YSIsInJvdyIsImFkZENoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztRQUlZQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBT0VDLEs7OztBQVNWOzs7Ozs7QUFNQSx1QkFBWUMsTUFBWixFQUF5QkMsWUFBekIsRUFBbUY7QUFBQTs7QUFBQTs7QUFabkYsa0JBQUFDLE1BQUEsR0FBa0IsSUFBbEI7QUFJQSxrQkFBQUMsYUFBQSxHQUF3QixPQUF4QjtBQVVJLGtCQUFLQyxXQUFMLENBQWlCSCxZQUFqQjtBQUNBLGtCQUFLSSxLQUFMO0FBQ0Esa0JBQUtMLE1BQUwsR0FBY0EsTUFBZDtBQUVBLGtCQUFLTSxXQUFMLEdBQW1CTixPQUFPTyxVQUExQjtBQUNBLGtCQUFLQyxVQUFMLEdBQWtCUixPQUFPUSxVQUF6QjtBQUNBLGtCQUFLQyxPQUFMLEdBQWVULE9BQU9TLE9BQXRCO0FBRUFYLGNBQUVZLE9BQUYsUUFFSSxnQkFGSixFQUdJLGVBSEo7QUFNQSxrQkFBS0MsRUFBTCxDQUFRLGNBQVIsRUFBd0IsTUFBS0MsY0FBN0I7QUFDQSxrQkFBS0QsRUFBTCxDQUFRLGFBQVIsRUFBdUIsTUFBS0UsYUFBNUI7QUFqQitFO0FBa0JsRjs7OztvQ0FFSTtBQUNEO0FBQ0EscUJBQUtDLEtBQUw7QUFDSDs7O29DQUtJO0FBQ0QscUJBQUtDLElBQUwsQ0FBVSxZQUFWO0FBQ0EscUJBQUtDLFFBQUwsQ0FBY0MsZUFBZDtBQUNBLHFCQUFLUixPQUFMLENBQWEsS0FBYjtBQUNIOzs7bUNBU01TLEksRUFBc0JDLEksRUFBYTtBQUN0QyxvQkFBSUMsTUFBTSxrQkFBUUYsSUFBUixFQUFjQSxJQUFkLENBQVY7QUFDQUUsb0JBQUlELElBQUosQ0FBU0EsSUFBVDtBQUNBLHFCQUFLRSxRQUFMLENBQWNELEdBQWQ7QUFFQSx1QkFBT0EsR0FBUDtBQUNIOzs7a0RBRWtCO0FBQ2Y7QUFDSDs7OzJDQUVXLENBRVg7QUFERzs7QUFHSjs7Ozs7OzZDQUdjO0FBQ1YscUJBQUtkLFdBQUwsQ0FBaUIsSUFBakI7QUFDSDs7OzRDQUtZO0FBQ1QscUJBQUtBLFdBQUwsQ0FBaUIsS0FBakI7QUFDSDs7Ozs7O3NCQXBGU1AsSyIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRWRpdGFibGVBcmVhIGZyb20gJy4vc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhJztcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi9zdGFnZS5kJztcbmltcG9ydCB7IFN0cnVjdHVyYWwgYXMgU3RydWN0dXJhbEludGVyZmFjZSB9IGZyb20gJy4vc3RhZ2Uvc3RydWN0dXJhbC9hYnN0cmFjdC5kJztcbmltcG9ydCBSb3cgZnJvbSAnLi9zdGFnZS9zdHJ1Y3R1cmFsL3Jvdyc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG4vKipcbiAqIFN0YWdlIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWdlIGV4dGVuZHMgRWRpdGFibGVBcmVhIGltcGxlbWVudHMgU3RhZ2VJbnRlcmZhY2Uge1xuICAgIHBhcmVudDogYW55O1xuICAgIHN0YWdlOiBTdGFnZTtcbiAgICBhY3RpdmU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHNob3dCb3JkZXJzOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgdXNlclNlbGVjdDogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIGxvYWRpbmc6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBzZXJpYWxpemVSb2xlOiBzdHJpbmcgPSAnc3RhZ2UnO1xuXG4gICAgLyoqXG4gICAgICogU3RhZ2UgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcGFyYW0gc3RhZ2VDb250ZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBhbnksIHN0YWdlQ29udGVudDogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8U3RydWN0dXJhbEludGVyZmFjZT4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zZXRDaGlsZHJlbihzdGFnZUNvbnRlbnQpO1xuICAgICAgICB0aGlzLnN0YWdlID0gdGhpcztcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICAgICAgdGhpcy5zaG93Qm9yZGVycyA9IHBhcmVudC5zaG93Qm9yZGVyO1xuICAgICAgICB0aGlzLnVzZXJTZWxlY3QgPSBwYXJlbnQudXNlclNlbGVjdDtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gcGFyZW50LmxvYWRpbmc7XG5cbiAgICAgICAgXy5iaW5kQWxsKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICdvblNvcnRpbmdTdGFydCcsXG4gICAgICAgICAgICAnb25Tb3J0aW5nU3RvcCdcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLm9uKCdzb3J0aW5nU3RhcnQnLCB0aGlzLm9uU29ydGluZ1N0YXJ0KTtcbiAgICAgICAgdGhpcy5vbignc29ydGluZ1N0b3AnLCB0aGlzLm9uU29ydGluZ1N0b3ApO1xuICAgIH1cblxuICAgIGJ1aWxkKCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHN0YWdlIGhhcyBiZWVuIGluaXRpYXRlZCBmdWxseSBhbmQgaXMgcmVhZHlcbiAgICAgKi9cbiAgICByZWFkeSgpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzdGFnZVJlYWR5Jyk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4udmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcm93IHRvIHRoZSBzdGFnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHNlbGZcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtSb3d9XG4gICAgICovXG4gICAgYWRkUm93KHNlbGY6IFN0YWdlSW50ZXJmYWNlLCBkYXRhPzogb2JqZWN0KTogUm93IHtcbiAgICAgICAgbGV0IHJvdyA9IG5ldyBSb3coc2VsZiwgc2VsZik7XG4gICAgICAgIHJvdy5kYXRhKGRhdGEpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHJvdyk7XG5cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG5cbiAgICBvcGVuVGVtcGxhdGVNYW5hZ2VyKCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgIH1cblxuICAgIGFkZENvbXBvbmVudCgpIHtcbiAgICAgICAgLy8gQHRvZG9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBhbnkgZWxlbWVudCBiZWluZyBzb3J0ZWQgaW4gdGhlIHN0YWdlXG4gICAgICovXG4gICAgb25Tb3J0aW5nU3RhcnQoKSB7XG4gICAgICAgIHRoaXMuc2hvd0JvcmRlcnModHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBzb3J0aW5nIHN0b3BzXG4gICAgICovXG4gICAgb25Tb3J0aW5nU3RvcCgpIHtcbiAgICAgICAgdGhpcy5zaG93Qm9yZGVycyhmYWxzZSk7XG4gICAgfVxufSJdfQ==
