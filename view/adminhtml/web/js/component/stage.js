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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS50cyJdLCJuYW1lcyI6WyJfIiwiU3RhZ2UiLCJwYXJlbnQiLCJzdGFnZUNvbnRlbnQiLCJhY3RpdmUiLCJzZXJpYWxpemVSb2xlIiwic2hvd0JvcmRlcnMiLCJzaG93Qm9yZGVyIiwidXNlclNlbGVjdCIsImxvYWRpbmciLCJiaW5kQWxsIiwib24iLCJvblNvcnRpbmdTdGFydCIsIm9uU29ydGluZ1N0b3AiLCJlbWl0IiwiY2hpbGRyZW4iLCJ2YWx1ZUhhc011dGF0ZWQiLCJzZWxmIiwiZGF0YSIsInJvdyIsImFkZENoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztRQUlZQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU9FQyxLOzs7QUFTVjs7Ozs7O0FBTUEsdUJBQVlDLE1BQVosRUFBeUJDLFlBQXpCLEVBQW1GO0FBQUE7O0FBQUE7O0FBWm5GLGtCQUFBQyxNQUFBLEdBQWtCLElBQWxCO0FBSUEsa0JBQUFDLGFBQUEsR0FBd0IsT0FBeEI7QUFVSSx3SEFBa0JGLFlBQWxCO0FBQ0Esa0JBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUVBLGtCQUFLSSxXQUFMLEdBQW1CSixPQUFPSyxVQUExQjtBQUNBLGtCQUFLQyxVQUFMLEdBQWtCTixPQUFPTSxVQUF6QjtBQUNBLGtCQUFLQyxPQUFMLEdBQWVQLE9BQU9PLE9BQXRCO0FBRUFULGNBQUVVLE9BQUYsUUFFSSxnQkFGSixFQUdJLGVBSEo7QUFNQSxrQkFBS0MsRUFBTCxDQUFRLGNBQVIsRUFBd0IsTUFBS0MsY0FBN0I7QUFDQSxrQkFBS0QsRUFBTCxDQUFRLGFBQVIsRUFBdUIsTUFBS0UsYUFBNUI7QUFoQitFO0FBaUJsRjs7OztvQ0FFSSxDQUVKO0FBREc7O0FBR0o7Ozs7OztvQ0FHSztBQUNELHFCQUFLQyxJQUFMLENBQVUsWUFBVjtBQUNBLHFCQUFLQyxRQUFMLENBQWNDLGVBQWQ7QUFDQSxxQkFBS1AsT0FBTCxDQUFhLEtBQWI7QUFDSDs7O21DQVNNUSxJLEVBQXNCQyxJLEVBQWE7QUFDdEMsb0JBQUlDLE1BQU0sa0JBQVFGLElBQVIsRUFBY0EsSUFBZCxDQUFWO0FBQ0FFLG9CQUFJRCxJQUFKLENBQVNBLElBQVQ7QUFDQSxxQkFBS0UsUUFBTCxDQUFjRCxHQUFkO0FBRUEsdUJBQU9BLEdBQVA7QUFDSDs7O2tEQUVrQjtBQUNmO0FBQ0g7OzsyQ0FFVyxDQUVYO0FBREc7O0FBR0o7Ozs7Ozs2Q0FHYztBQUNWLHFCQUFLYixXQUFMLENBQWlCLElBQWpCO0FBQ0g7Ozs0Q0FLWTtBQUNULHFCQUFLQSxXQUFMLENBQWlCLEtBQWpCO0FBQ0g7Ozs7OztzQkFsRlNMLEsiLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVkaXRhYmxlQXJlYSBmcm9tICcuL3N0YWdlL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYSc7XG5pbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4vc3RhZ2UuZCc7XG5pbXBvcnQgeyBTdHJ1Y3R1cmFsIGFzIFN0cnVjdHVyYWxJbnRlcmZhY2UgfSBmcm9tICcuL3N0YWdlL3N0cnVjdHVyYWwvYWJzdHJhY3QuZCc7XG5pbXBvcnQgUm93IGZyb20gJy4vc3RhZ2Uvc3RydWN0dXJhbC9yb3cnO1xuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuLyoqXG4gKiBTdGFnZSBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFnZSBleHRlbmRzIEVkaXRhYmxlQXJlYSBpbXBsZW1lbnRzIFN0YWdlSW50ZXJmYWNlIHtcbiAgICBwYXJlbnQ6IGFueTtcbiAgICBzdGFnZTogU3RhZ2U7XG4gICAgYWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcbiAgICBzaG93Qm9yZGVyczogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIHVzZXJTZWxlY3Q6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBsb2FkaW5nOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgc2VyaWFsaXplUm9sZTogc3RyaW5nID0gJ3N0YWdlJztcblxuICAgIC8qKlxuICAgICAqIFN0YWdlIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIHN0YWdlQ29udGVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogYW55LCBzdGFnZUNvbnRlbnQ6IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PFN0cnVjdHVyYWxJbnRlcmZhY2U+KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHN1cGVyLnNldENoaWxkcmVuKHN0YWdlQ29udGVudCk7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXG4gICAgICAgIHRoaXMuc2hvd0JvcmRlcnMgPSBwYXJlbnQuc2hvd0JvcmRlcjtcbiAgICAgICAgdGhpcy51c2VyU2VsZWN0ID0gcGFyZW50LnVzZXJTZWxlY3Q7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHBhcmVudC5sb2FkaW5nO1xuXG4gICAgICAgIF8uYmluZEFsbChcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAnb25Tb3J0aW5nU3RhcnQnLFxuICAgICAgICAgICAgJ29uU29ydGluZ1N0b3AnXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5vbignc29ydGluZ1N0YXJ0JywgdGhpcy5vblNvcnRpbmdTdGFydCk7XG4gICAgICAgIHRoaXMub24oJ3NvcnRpbmdTdG9wJywgdGhpcy5vblNvcnRpbmdTdG9wKTtcbiAgICB9XG5cbiAgICBidWlsZCgpIHtcbiAgICAgICAgLy8gQHRvZG9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc3RhZ2UgaGFzIGJlZW4gaW5pdGlhdGVkIGZ1bGx5IGFuZCBpcyByZWFkeVxuICAgICAqL1xuICAgIHJlYWR5KCkge1xuICAgICAgICB0aGlzLmVtaXQoJ3N0YWdlUmVhZHknKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nKGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSByb3cgdG8gdGhlIHN0YWdlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VsZlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge1Jvd31cbiAgICAgKi9cbiAgICBhZGRSb3coc2VsZjogU3RhZ2VJbnRlcmZhY2UsIGRhdGE/OiBvYmplY3QpOiBSb3cge1xuICAgICAgICBsZXQgcm93ID0gbmV3IFJvdyhzZWxmLCBzZWxmKTtcbiAgICAgICAgcm93LmRhdGEoZGF0YSk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQocm93KTtcblxuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cblxuICAgIG9wZW5UZW1wbGF0ZU1hbmFnZXIoKSB7XG4gICAgICAgIC8vIEB0b2RvXG4gICAgfVxuXG4gICAgYWRkQ29tcG9uZW50KCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIGFueSBlbGVtZW50IGJlaW5nIHNvcnRlZCBpbiB0aGUgc3RhZ2VcbiAgICAgKi9cbiAgICBvblNvcnRpbmdTdGFydCgpIHtcbiAgICAgICAgdGhpcy5zaG93Qm9yZGVycyh0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciB3aGVuIHNvcnRpbmcgc3RvcHNcbiAgICAgKi9cbiAgICBvblNvcnRpbmdTdG9wKCkge1xuICAgICAgICB0aGlzLnNob3dCb3JkZXJzKGZhbHNlKTtcbiAgICB9XG59Il19
