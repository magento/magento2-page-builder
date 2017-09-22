define(["exports", "./block"], function (exports, _block) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _block2 = _interopRequireDefault(_block);

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

    var InlineBlock = function (_Block) {
        _inherits(InlineBlock, _Block);

        function InlineBlock() {
            _classCallCheck(this, InlineBlock);

            var _this = _possibleConstructorReturn(this, _Block.apply(this, arguments));

            _this.editOnInsert = false;
            return _this;
        }

        return InlineBlock;
    }(_block2.default);

    exports.default = InlineBlock;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9pbmxpbmUudHMiLCJjb21wb25lbnQvYmxvY2svaW5saW5lLmpzIl0sIm5hbWVzIjpbIklubGluZUJsb2NrIiwiYXJndW1lbnRzIiwiZWRpdE9uSW5zZXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFPY0EsVzs7O0FBQWQsK0JBQUE7QUFBQTs7QUFBQSx5RENDUSxtQkFBU0MsU0FBVCxDRERSOztBQUNJLGtCQUFBQyxZQUFBLEdBQXdCLEtBQXhCO0FBREo7QUFFQzs7Ozs7c0JBRmFGLFciLCJmaWxlIjoiY29tcG9uZW50L2Jsb2NrL2lubGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbG9jayBmcm9tIFwiLi9ibG9ja1wiO1xuXG4vKipcbiAqIElubGluZUJsb2NrIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElubGluZUJsb2NrIGV4dGVuZHMgQmxvY2sge1xuICAgIGVkaXRPbkluc2VydDogYm9vbGVhbiA9IGZhbHNlO1xufSIsImltcG9ydCBCbG9jayBmcm9tIFwiLi9ibG9ja1wiO1xuLyoqXG4gKiBJbmxpbmVCbG9jayBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmxpbmVCbG9jayBleHRlbmRzIEJsb2NrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5lZGl0T25JbnNlcnQgPSBmYWxzZTtcbiAgICB9XG59XG4iXX0=
