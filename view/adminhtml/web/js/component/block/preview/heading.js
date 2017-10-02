define(['exports', './block', 'mage/translate'], function (exports, _block, _translate) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _block2 = _interopRequireDefault(_block);

    var _translate2 = _interopRequireDefault(_translate);

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

    var Heading = function (_PreviewBlock) {
        _inherits(Heading, _PreviewBlock);

        function Heading() {
            _classCallCheck(this, Heading);

            var _this = _possibleConstructorReturn(this, _PreviewBlock.apply(this, arguments));

            // @todo move these into UI component declaration
            _this.defaults = {
                heading_type: 'h2',
                title: (0, _translate2.default)('Start typing your heading here...')
            };
            return _this;
        }

        return Heading;
    }(_block2.default);

    exports.default = Heading;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9wcmV2aWV3L2hlYWRpbmcudHMiLCJjb21wb25lbnQvYmxvY2svcHJldmlldy9oZWFkaW5nLmpzIl0sIm5hbWVzIjpbIkhlYWRpbmciLCJhcmd1bWVudHMiLCJkZWZhdWx0cyIsImhlYWRpbmdfdHlwZSIsInRpdGxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQVFjQSxPOzs7QUFBZCwyQkFBQTtBQUFBOztBQUFBLHlEQ0NRLDBCQUFTQyxTQUFULENERFI7O0FBQ0k7QUFDQSxrQkFBQUMsUUFBQSxHQUFtQjtBQUNmQyw4QkFBYyxJQURDO0FBRWZDLHVCQUFPLHlCQUFHLG1DQUFIO0FBRlEsYUFBbkI7QUFGSjtBQU1DOzs7OztzQkFOYUosTyIsImZpbGUiOiJjb21wb25lbnQvYmxvY2svcHJldmlldy9oZWFkaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByZXZpZXdCbG9jayBmcm9tIFwiLi9ibG9ja1wiO1xuaW1wb3J0ICR0IGZyb20gJ21hZ2UvdHJhbnNsYXRlJztcblxuLyoqXG4gKiBDbGFzcyBIZWFkaW5nXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRpbmcgZXh0ZW5kcyBQcmV2aWV3QmxvY2sge1xuICAgIC8vIEB0b2RvIG1vdmUgdGhlc2UgaW50byBVSSBjb21wb25lbnQgZGVjbGFyYXRpb25cbiAgICBkZWZhdWx0czogb2JqZWN0ID0ge1xuICAgICAgICBoZWFkaW5nX3R5cGU6ICdoMicsXG4gICAgICAgIHRpdGxlOiAkdCgnU3RhcnQgdHlwaW5nIHlvdXIgaGVhZGluZyBoZXJlLi4uJylcbiAgICB9XG59IiwiaW1wb3J0IFByZXZpZXdCbG9jayBmcm9tIFwiLi9ibG9ja1wiO1xuaW1wb3J0ICR0IGZyb20gJ21hZ2UvdHJhbnNsYXRlJztcbi8qKlxuICogQ2xhc3MgSGVhZGluZ1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkaW5nIGV4dGVuZHMgUHJldmlld0Jsb2NrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLy8gQHRvZG8gbW92ZSB0aGVzZSBpbnRvIFVJIGNvbXBvbmVudCBkZWNsYXJhdGlvblxuICAgICAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgICAgICAgaGVhZGluZ190eXBlOiAnaDInLFxuICAgICAgICAgICAgdGl0bGU6ICR0KCdTdGFydCB0eXBpbmcgeW91ciBoZWFkaW5nIGhlcmUuLi4nKVxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdfQ==
