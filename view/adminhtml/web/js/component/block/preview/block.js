define(["exports", "underscore", "knockout"], function (exports, _underscore, _knockout) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _underscore2 = _interopRequireDefault(_underscore);

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

    var PreviewBlock = function () {
        function PreviewBlock(parent, config) {
            var _this = this;

            _classCallCheck(this, PreviewBlock);

            this.template = '';
            this.data = {};
            this.parent = parent;
            this.config = config;
            if (typeof this.config.preview_template !== 'undefined' && this.config.preview_template) {
                this.template = this.config.preview_template;
            }
            // Subscribe to this blocks data in the store
            this.parent.stage.store.subscribe(function (data) {
                var missingFields = _underscore2.default.difference(_this.config.fields_list, _underscore2.default.keys(data));
                missingFields.forEach(function (key) {
                    _this.updateDataValue(key, '');
                });
                _underscore2.default.forEach(data, function (value, key) {
                    _this.updateDataValue(key, value);
                });
            }, this.parent.id);
        }
        /**
         * Update the data value of a part of our internal Knockout data store
         *
         * @param {string} key
         * @param value
         */


        PreviewBlock.prototype.updateDataValue = function updateDataValue(key, value) {
            if (typeof this.data[key] !== 'undefined' && _knockout2.default.isObservable(this.data[key])) {
                this.data[key](value);
            } else {
                this.data[key] = _knockout2.default.observable(value);
            }
        };

        return PreviewBlock;
    }();

    exports.default = PreviewBlock;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9wcmV2aWV3L2Jsb2NrLnRzIl0sIm5hbWVzIjpbIlByZXZpZXdCbG9jayIsInBhcmVudCIsImNvbmZpZyIsInRlbXBsYXRlIiwiZGF0YSIsInByZXZpZXdfdGVtcGxhdGUiLCJzdGFnZSIsInN0b3JlIiwic3Vic2NyaWJlIiwibWlzc2luZ0ZpZWxkcyIsImRpZmZlcmVuY2UiLCJmaWVsZHNfbGlzdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwidXBkYXRlRGF0YVZhbHVlIiwidmFsdWUiLCJpZCIsImlzT2JzZXJ2YWJsZSIsIm9ic2VydmFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBYWNBLFk7QUFNViw4QkFBWUMsTUFBWixFQUEyQkMsTUFBM0IsRUFBeUM7QUFBQTs7QUFBQTs7QUFMekMsaUJBQUFDLFFBQUEsR0FBbUIsRUFBbkI7QUFHQSxpQkFBQUMsSUFBQSxHQUFvQixFQUFwQjtBQUdJLGlCQUFLSCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxpQkFBS0MsTUFBTCxHQUFjQSxNQUFkO0FBRUEsZ0JBQUksT0FBTyxLQUFLQSxNQUFMLENBQVlHLGdCQUFuQixLQUF3QyxXQUF4QyxJQUF1RCxLQUFLSCxNQUFMLENBQVlHLGdCQUF2RSxFQUF5RjtBQUNyRixxQkFBS0YsUUFBTCxHQUFnQixLQUFLRCxNQUFMLENBQVlHLGdCQUE1QjtBQUNIO0FBRUQ7QUFDQSxpQkFBS0osTUFBTCxDQUFZSyxLQUFaLENBQWtCQyxLQUFsQixDQUF3QkMsU0FBeEIsQ0FDSSxVQUFDSixJQUFELEVBQXFCO0FBQ2pCLG9CQUFNSyxnQkFBZ0IscUJBQUVDLFVBQUYsQ0FBYSxNQUFLUixNQUFMLENBQVlTLFdBQXpCLEVBQXNDLHFCQUFFQyxJQUFGLENBQU9SLElBQVAsQ0FBdEMsQ0FBdEI7QUFDQUssOEJBQWNJLE9BQWQsQ0FBc0IsVUFBQ0MsR0FBRCxFQUFJO0FBQ3RCLDBCQUFLQyxlQUFMLENBQXFCRCxHQUFyQixFQUEwQixFQUExQjtBQUNILGlCQUZEO0FBR0EscUNBQUVELE9BQUYsQ0FBVVQsSUFBVixFQUFnQixVQUFDWSxLQUFELEVBQVFGLEdBQVIsRUFBVztBQUN2QiwwQkFBS0MsZUFBTCxDQUFxQkQsR0FBckIsRUFBMEJFLEtBQTFCO0FBQ0gsaUJBRkQ7QUFHSCxhQVRMLEVBVUksS0FBS2YsTUFBTCxDQUFZZ0IsRUFWaEI7QUFZSDtBQUVEOzs7Ozs7OzsrQkFNUUYsZSw0QkFBZ0JELEcsRUFBYUUsSyxFQUFVO0FBQzNDLGdCQUFJLE9BQU8sS0FBS1osSUFBTCxDQUFVVSxHQUFWLENBQVAsS0FBMEIsV0FBMUIsSUFBeUMsbUJBQUdJLFlBQUgsQ0FBZ0IsS0FBS2QsSUFBTCxDQUFVVSxHQUFWLENBQWhCLENBQTdDLEVBQThFO0FBQzFFLHFCQUFLVixJQUFMLENBQVVVLEdBQVYsRUFBZUUsS0FBZjtBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLWixJQUFMLENBQVVVLEdBQVYsSUFBaUIsbUJBQUdLLFVBQUgsQ0FBY0gsS0FBZCxDQUFqQjtBQUNIO0FBQ0osUzs7Ozs7c0JBekNTaEIsWSIsImZpbGUiOiJjb21wb25lbnQvYmxvY2svcHJldmlldy9ibG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbG9jayBmcm9tIFwiLi4vYmxvY2tcIjtcbmltcG9ydCBfLCB7RGljdGlvbmFyeX0gZnJvbSBcInVuZGVyc2NvcmVcIjtcbmltcG9ydCBrbyBmcm9tIFwia25vY2tvdXRcIjtcblxuaW50ZXJmYWNlIFByZXZpZXdEYXRhIHtcbiAgICBba2V5OiBzdHJpbmddOiBLbm9ja291dE9ic2VydmFibGU8YW55Pjtcbn1cblxuLyoqXG4gKiBQcmV2aWV3QmxvY2sgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJldmlld0Jsb2NrIHtcbiAgICB0ZW1wbGF0ZTogc3RyaW5nID0gJyc7XG4gICAgcGFyZW50OiBCbG9jaztcbiAgICBjb25maWc6IGFueTtcbiAgICBkYXRhOiBQcmV2aWV3RGF0YSA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBCbG9jaywgY29uZmlnOiBvYmplY3QpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb25maWcucHJldmlld190ZW1wbGF0ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy5jb25maWcucHJldmlld190ZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRoaXMuY29uZmlnLnByZXZpZXdfdGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdWJzY3JpYmUgdG8gdGhpcyBibG9ja3MgZGF0YSBpbiB0aGUgc3RvcmVcbiAgICAgICAgdGhpcy5wYXJlbnQuc3RhZ2Uuc3RvcmUuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGRhdGE6IERpY3Rpb25hcnk8e30+KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWlzc2luZ0ZpZWxkcyA9IF8uZGlmZmVyZW5jZSh0aGlzLmNvbmZpZy5maWVsZHNfbGlzdCwgXy5rZXlzKGRhdGEpKTtcbiAgICAgICAgICAgICAgICBtaXNzaW5nRmllbGRzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZURhdGFWYWx1ZShrZXksICcnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2goZGF0YSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVEYXRhVmFsdWUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuaWRcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIGRhdGEgdmFsdWUgb2YgYSBwYXJ0IG9mIG91ciBpbnRlcm5hbCBLbm9ja291dCBkYXRhIHN0b3JlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgcHJpdmF0ZSB1cGRhdGVEYXRhVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmRhdGFba2V5XSAhPT0gJ3VuZGVmaW5lZCcgJiYga28uaXNPYnNlcnZhYmxlKHRoaXMuZGF0YVtrZXldKSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2tleV0odmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2tleV0gPSBrby5vYnNlcnZhYmxlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=
