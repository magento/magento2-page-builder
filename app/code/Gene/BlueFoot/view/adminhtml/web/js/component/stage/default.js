define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Default = function () {
        function Default() {
            _classCallCheck(this, Default);
        }

        Default.prototype.read = function read(element) {
            var data = {};
            Object.keys(element.style).map(function (key) {
                if (isNaN(key) && element.style[key] !== '') {
                    data[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = element.style[key];
                }
            });
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