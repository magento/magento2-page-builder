define(['exports', 'underscore', '../../../utils/style-attribute-mapper'], function (exports, _underscore, _styleAttributeMapper) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _underscore2 = _interopRequireDefault(_underscore);

    var _styleAttributeMapper2 = _interopRequireDefault(_styleAttributeMapper);

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

    var Default = function () {
        function Default() {
            _classCallCheck(this, Default);

            this.styleAttributeMapper = new _styleAttributeMapper2.default();
        }
        /**
         * Read data, style and css properties from the element
         *
         * @param element HTMLElement
         * @returns {Promise<any>}
         */


        Default.prototype.read = function read(element) {
            var data = {};
            var styleAttributes = {};
            Object.keys(element.style).map(function (key) {
                if (isNaN(key) && element.style[key] !== '') {
                    styleAttributes[key] = element.style[key];
                }
            });
            _underscore2.default.extend(data, this.styleAttributeMapper.fromDom(styleAttributes));
            Object.keys(element.dataset).map(function (key) {
                if (element.dataset[key] !== '') {
                    data[key] = element.dataset[key];
                }
            });
            data['css_classes'] = element.className.split(' ');
            return new Promise(function (resolve) {
                resolve(data);
            });
        };

        return Default;
    }();

    exports.default = Default;
});