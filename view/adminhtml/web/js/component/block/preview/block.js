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
            _classCallCheck(this, PreviewBlock);

            this.template = '';
            this.parent = parent;
            this.config = config;
            if (typeof this.config.preview_template !== 'undefined' && this.config.preview_template) {
                this.template = this.config.preview_template;
            }
            this.setupFields();
        }
        /**
         * Create each individuall field as an observable on the class
         */


        PreviewBlock.prototype.setupFields = function setupFields() {
            _underscore2.default.forEach(this.config.fields_list, function (field) {
                this[field] = _knockout2.default.observable();
            }.bind(this));
        };

        return PreviewBlock;
    }();

    exports.default = PreviewBlock;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9wcmV2aWV3L2Jsb2NrLnRzIl0sIm5hbWVzIjpbIlByZXZpZXdCbG9jayIsInBhcmVudCIsImNvbmZpZyIsInRlbXBsYXRlIiwicHJldmlld190ZW1wbGF0ZSIsInNldHVwRmllbGRzIiwiZm9yRWFjaCIsImZpZWxkc19saXN0IiwiZmllbGQiLCJvYnNlcnZhYmxlIiwiYmluZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFTY0EsWTtBQUtWLDhCQUFZQyxNQUFaLEVBQTJCQyxNQUEzQixFQUF5QztBQUFBOztBQUp6QyxpQkFBQUMsUUFBQSxHQUFtQixFQUFuQjtBQUtJLGlCQUFLRixNQUFMLEdBQWNBLE1BQWQ7QUFDQSxpQkFBS0MsTUFBTCxHQUFjQSxNQUFkO0FBRUEsZ0JBQUksT0FBTyxLQUFLQSxNQUFMLENBQVlFLGdCQUFuQixLQUF3QyxXQUF4QyxJQUF1RCxLQUFLRixNQUFMLENBQVlFLGdCQUF2RSxFQUF5RjtBQUNyRixxQkFBS0QsUUFBTCxHQUFnQixLQUFLRCxNQUFMLENBQVlFLGdCQUE1QjtBQUNIO0FBRUQsaUJBQUtDLFdBQUw7QUFDSDtBQUVEOzs7OzsrQkFHQUEsVywwQkFBVztBQUNQLGlDQUFFQyxPQUFGLENBQVUsS0FBS0osTUFBTCxDQUFZSyxXQUF0QixFQUFtQyxVQUFVQyxLQUFWLEVBQXVCO0FBQ3RELHFCQUFLQSxLQUFMLElBQWMsbUJBQUdDLFVBQUgsRUFBZDtBQUNILGFBRmtDLENBRWpDQyxJQUZpQyxDQUU1QixJQUY0QixDQUFuQztBQUdILFM7Ozs7O3NCQXZCU1YsWSIsImZpbGUiOiJjb21wb25lbnQvYmxvY2svcHJldmlldy9ibG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbG9jayBmcm9tIFwiLi4vYmxvY2tcIjtcbmltcG9ydCBfIGZyb20gXCJ1bmRlcnNjb3JlXCI7XG5pbXBvcnQga28gZnJvbSBcImtub2Nrb3V0XCI7XG5cbi8qKlxuICogUHJldmlld0Jsb2NrIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXZpZXdCbG9jayB7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICcnO1xuICAgIHBhcmVudDogQmxvY2s7XG4gICAgY29uZmlnOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IEJsb2NrLCBjb25maWc6IG9iamVjdCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmNvbmZpZy5wcmV2aWV3X3RlbXBsYXRlICE9PSAndW5kZWZpbmVkJyAmJiB0aGlzLmNvbmZpZy5wcmV2aWV3X3RlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5jb25maWcucHJldmlld190ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0dXBGaWVsZHMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgZWFjaCBpbmRpdmlkdWFsbCBmaWVsZCBhcyBhbiBvYnNlcnZhYmxlIG9uIHRoZSBjbGFzc1xuICAgICAqL1xuICAgIHNldHVwRmllbGRzKCkge1xuICAgICAgICBfLmZvckVhY2godGhpcy5jb25maWcuZmllbGRzX2xpc3QsIGZ1bmN0aW9uIChmaWVsZDogc3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzW2ZpZWxkXSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG59Il19
