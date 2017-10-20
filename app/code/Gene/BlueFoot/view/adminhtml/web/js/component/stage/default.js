define(['exports', 'underscore', '../../utils/dom-attribute-mapper'], function (exports, _underscore, _domAttributeMapper) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _underscore2 = _interopRequireDefault(_underscore);

    var _domAttributeMapper2 = _interopRequireDefault(_domAttributeMapper);

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

            this.domAttributeMapper = new _domAttributeMapper2.default();
        }
        /**
         * Read data, style and css properties from the element
         *
         * @param element
         * @returns {object}
         */


        Default.prototype.read = function read(element) {
            var data = {};
            var styleAttributes = {};
            Object.keys(element.style).map(function (key) {
                if (isNaN(key) && element.style[key] !== '') {
                    styleAttributes[key] = element.style[key];
                }
            });
            _underscore2.default.extend(data, this.domAttributeMapper.fromDom(styleAttributes));
            Object.keys(element.dataset).map(function (key) {
                if (element.dataset[key] !== '') {
                    data[key] = element.dataset[key];
                }
            });
            data['css_classes'] = element.className.split(' ');
            return data;
        };

        return Default;
    }();

    exports.default = Default;
});