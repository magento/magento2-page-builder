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
                    var value = element.style[key];
                    if (key === 'minHeight') {
                        value = value.replace('px', '');
                    }
                    if (key === 'backgroundRepeat') {
                        value = value === 'repeat' ? '1' : '0';
                    }
                    if (key === 'backgroundColor') {
                        var regexp = /(\d{3}),\s(\d{3}),\s(\d{3})/;
                        var matches = regexp.exec(value);
                        value = '#' + this.toHex(parseInt(matches[1])) + this.toHex(parseInt(matches[2])) + this.toHex(parseInt(matches[1]));
                    }
                    data[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = value;
                }
            }.bind(this));
            Object.keys(element.dataset).map(function (key) {
                if (element.dataset[key] !== '') {
                    data[key] = element.dataset[key];
                }
            });
            data['css_classes'] = element.className.split(' ');
            return data;
        };

        Default.prototype.toHex = function toHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };

        return Default;
    }();

    exports.default = Default;
});