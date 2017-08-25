define(['exports', './stage/structural/editable-area', './stage/structural/row', 'underscore'], function (exports, _editableArea, _row, _underscore) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Stage = undefined;

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

    var Stage = exports.Stage = function (_EditableArea) {
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
            _get(Stage.prototype.__proto__ || Object.getPrototypeOf(Stage.prototype), 'setChildren', _this).call(_this, stageContent);
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
            value: function build() {}
            // @todo

            /**
             * The stage has been initiated fully and is ready
             */

        }, {
            key: 'ready',
            value: function ready() {
                this.emit('stageReady');
                this.children.valueHasMutated();
                this.loading(false);
            }
            /**
             * Add a row to the stage
             *
             * @param self
             * @param data
             * @returns {Row}
             */

        }, {
            key: 'addRow',
            value: function addRow(self, data) {
                var row = new _row.Row(self, self);
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
            /**
             * Event handler for when sorting stops
             */

        }, {
            key: 'onSortingStop',
            value: function onSortingStop() {
                this.showBorders(false);
            }
        }]);

        return Stage;
    }(_editableArea.EditableArea);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvc3RhZ2UudHMiXSwibmFtZXMiOlsiXyIsIlN0YWdlIiwicGFyZW50Iiwic3RhZ2VDb250ZW50IiwiYWN0aXZlIiwic2VyaWFsaXplUm9sZSIsInNob3dCb3JkZXJzIiwic2hvd0JvcmRlciIsInVzZXJTZWxlY3QiLCJsb2FkaW5nIiwiYmluZEFsbCIsIm9uIiwib25Tb3J0aW5nU3RhcnQiLCJvblNvcnRpbmdTdG9wIiwiZW1pdCIsImNoaWxkcmVuIiwidmFsdWVIYXNNdXRhdGVkIiwic2VsZiIsImRhdGEiLCJyb3ciLCJhZGRDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFJWUEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFPTkMsSyxXQUFBQSxLOzs7QUFTRjs7Ozs7O0FBTUEsdUJBQVlDLE1BQVosRUFBeUJDLFlBQXpCLEVBQW1GO0FBQUE7O0FBQUE7O0FBWm5GLGtCQUFBQyxNQUFBLEdBQWtCLElBQWxCO0FBSUEsa0JBQUFDLGFBQUEsR0FBd0IsT0FBeEI7QUFVSSx3SEFBa0JGLFlBQWxCO0FBQ0Esa0JBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUVBLGtCQUFLSSxXQUFMLEdBQW1CSixPQUFPSyxVQUExQjtBQUNBLGtCQUFLQyxVQUFMLEdBQWtCTixPQUFPTSxVQUF6QjtBQUNBLGtCQUFLQyxPQUFMLEdBQWVQLE9BQU9PLE9BQXRCO0FBRUFULGNBQUVVLE9BQUYsUUFFSSxnQkFGSixFQUdJLGVBSEo7QUFNQSxrQkFBS0MsRUFBTCxDQUFRLGNBQVIsRUFBd0IsTUFBS0MsY0FBN0I7QUFDQSxrQkFBS0QsRUFBTCxDQUFRLGFBQVIsRUFBdUIsTUFBS0UsYUFBNUI7QUFoQitFO0FBaUJsRjs7OztvQ0FFSSxDQUVKO0FBREc7O0FBR0o7Ozs7OztvQ0FHSztBQUNELHFCQUFLQyxJQUFMLENBQVUsWUFBVjtBQUNBLHFCQUFLQyxRQUFMLENBQWNDLGVBQWQ7QUFDQSxxQkFBS1AsT0FBTCxDQUFhLEtBQWI7QUFDSDtBQUVEOzs7Ozs7Ozs7O21DQU9PUSxJLEVBQXNCQyxJLEVBQWE7QUFDdEMsb0JBQUlDLE1BQU0sYUFBUUYsSUFBUixFQUFjQSxJQUFkLENBQVY7QUFDQUUsb0JBQUlELElBQUosQ0FBU0EsSUFBVDtBQUNBLHFCQUFLRSxRQUFMLENBQWNELEdBQWQ7QUFFQSx1QkFBT0EsR0FBUDtBQUNIOzs7a0RBRWtCO0FBQ2Y7QUFDSDs7OzJDQUVXLENBRVg7QUFERzs7QUFHSjs7Ozs7OzZDQUdjO0FBQ1YscUJBQUtiLFdBQUwsQ0FBaUIsSUFBakI7QUFDSDtBQUVEOzs7Ozs7NENBR2E7QUFDVCxxQkFBS0EsV0FBTCxDQUFpQixLQUFqQjtBQUNIIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRhYmxlQXJlYSB9IGZyb20gJy4vc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhJztcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi9zdGFnZS5kJztcbmltcG9ydCB7IFN0cnVjdHVyYWwgYXMgU3RydWN0dXJhbEludGVyZmFjZSB9IGZyb20gJy4vc3RhZ2Uvc3RydWN0dXJhbC9hYnN0cmFjdC5kJztcbmltcG9ydCB7IFJvdyB9IGZyb20gJy4vc3RhZ2Uvc3RydWN0dXJhbC9yb3cnO1xuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuLyoqXG4gKiBTdGFnZSBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgU3RhZ2UgZXh0ZW5kcyBFZGl0YWJsZUFyZWEgaW1wbGVtZW50cyBTdGFnZUludGVyZmFjZSB7XG4gICAgcGFyZW50OiBhbnk7XG4gICAgc3RhZ2U6IFN0YWdlO1xuICAgIGFjdGl2ZTogYm9vbGVhbiA9IHRydWU7XG4gICAgc2hvd0JvcmRlcnM6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICB1c2VyU2VsZWN0OiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgbG9hZGluZzogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIHNlcmlhbGl6ZVJvbGU6IHN0cmluZyA9ICdzdGFnZSc7XG5cbiAgICAvKipcbiAgICAgKiBTdGFnZSBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEBwYXJhbSBzdGFnZUNvbnRlbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGFueSwgc3RhZ2VDb250ZW50OiBLbm9ja291dE9ic2VydmFibGVBcnJheTxTdHJ1Y3R1cmFsSW50ZXJmYWNlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBzdXBlci5zZXRDaGlsZHJlbihzdGFnZUNvbnRlbnQpO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblxuICAgICAgICB0aGlzLnNob3dCb3JkZXJzID0gcGFyZW50LnNob3dCb3JkZXI7XG4gICAgICAgIHRoaXMudXNlclNlbGVjdCA9IHBhcmVudC51c2VyU2VsZWN0O1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBwYXJlbnQubG9hZGluZztcblxuICAgICAgICBfLmJpbmRBbGwoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgJ29uU29ydGluZ1N0YXJ0JyxcbiAgICAgICAgICAgICdvblNvcnRpbmdTdG9wJ1xuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMub24oJ3NvcnRpbmdTdGFydCcsIHRoaXMub25Tb3J0aW5nU3RhcnQpO1xuICAgICAgICB0aGlzLm9uKCdzb3J0aW5nU3RvcCcsIHRoaXMub25Tb3J0aW5nU3RvcCk7XG4gICAgfVxuXG4gICAgYnVpbGQoKSB7XG4gICAgICAgIC8vIEB0b2RvXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHN0YWdlIGhhcyBiZWVuIGluaXRpYXRlZCBmdWxseSBhbmQgaXMgcmVhZHlcbiAgICAgKi9cbiAgICByZWFkeSgpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzdGFnZVJlYWR5Jyk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4udmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcm93IHRvIHRoZSBzdGFnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHNlbGZcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtSb3d9XG4gICAgICovXG4gICAgYWRkUm93KHNlbGY6IFN0YWdlSW50ZXJmYWNlLCBkYXRhPzogb2JqZWN0KTogUm93IHtcbiAgICAgICAgbGV0IHJvdyA9IG5ldyBSb3coc2VsZiwgc2VsZik7XG4gICAgICAgIHJvdy5kYXRhKGRhdGEpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHJvdyk7XG5cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG5cbiAgICBvcGVuVGVtcGxhdGVNYW5hZ2VyKCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgIH1cblxuICAgIGFkZENvbXBvbmVudCgpIHtcbiAgICAgICAgLy8gQHRvZG9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBhbnkgZWxlbWVudCBiZWluZyBzb3J0ZWQgaW4gdGhlIHN0YWdlXG4gICAgICovXG4gICAgb25Tb3J0aW5nU3RhcnQoKSB7XG4gICAgICAgIHRoaXMuc2hvd0JvcmRlcnModHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBzb3J0aW5nIHN0b3BzXG4gICAgICovXG4gICAgb25Tb3J0aW5nU3RvcCgpIHtcbiAgICAgICAgdGhpcy5zaG93Qm9yZGVycyhmYWxzZSk7XG4gICAgfVxufSJdfQ==
