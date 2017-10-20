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

    var DomAttributeMapper = function () {
        function DomAttributeMapper() {
            _classCallCheck(this, DomAttributeMapper);
        }

        DomAttributeMapper.prototype.fromDom = function fromDom(object) {
            var result = {};
            Object.keys(object).map(function (key) {
                var value = object[key];
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
                result[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = value;
            }.bind(this));
            return result;
        };

        DomAttributeMapper.prototype.toHex = function toHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };

        DomAttributeMapper.prototype.toDom = function toDom(object) {
            var result = {};
            Object.keys(object).map(function (key) {
                if (key === 'role') {
                    //key = 'data_role'
                }
                result[this.fromSnakeToCamelCase(key)] = object[key];
            }.bind(this));
            return result;
        };

        DomAttributeMapper.prototype.fromSnakeToCamelCase = function fromSnakeToCamelCase(string) {
            var parts = string.split(/[_-]/);
            var newString = '';
            for (var i = 1; i < parts.length; i++) {
                newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
            }
            return parts[0] + newString;
        };

        return DomAttributeMapper;
    }();

    exports.default = DomAttributeMapper;
});