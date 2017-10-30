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

    var StyleAttributeMapper = function () {
        function StyleAttributeMapper() {
            _classCallCheck(this, StyleAttributeMapper);
        }

        StyleAttributeMapper.prototype.toDom = function toDom(data) {
            var result = {};
            Object.keys(data).map(function (key) {
                var value = data[key];
                if (key === 'min_height') {
                    value = value.replace('px', '') + 'px';
                }
                if (key === 'background_repeat') {
                    value = value ? 'repeat' : 'no-repeat';
                }
                result[this.fromSnakeToCamelCase(key)] = value;
            }.bind(this));
            return result;
        };

        StyleAttributeMapper.prototype.fromDom = function fromDom(data) {
            var result = {};
            Object.keys(data).map(function (key) {
                var value = data[key];
                if (key === 'minHeight') {
                    value = value.replace('px', '');
                }
                if (key === 'backgroundRepeat') {
                    value = value === 'repeat' ? '1' : '0';
                }
                if (key === 'backgroundColor') {
                    var regexp = /(\d{3}),\s(\d{3}),\s(\d{3})/;
                    var matches = regexp.exec(value);
                    value = '#' + this.fromIntToHex(parseInt(matches[1])) + this.fromIntToHex(parseInt(matches[2])) + this.fromIntToHex(parseInt(matches[1]));
                }
                result[this.fromCamelToSnakeCase(key)] = value;
            }.bind(this));
            return result;
        };

        StyleAttributeMapper.prototype.fromSnakeToCamelCase = function fromSnakeToCamelCase(string) {
            var parts = string.split(/[_-]/);
            var newString = '';
            for (var i = 1; i < parts.length; i++) {
                newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
            }
            return parts[0] + newString;
        };

        StyleAttributeMapper.prototype.fromCamelToSnakeCase = function fromCamelToSnakeCase(key) {
            return key.split(/(?=[A-Z])/).join('_').toLowerCase();
        };

        StyleAttributeMapper.prototype.fromIntToHex = function fromIntToHex(value) {
            var hex = value.toString(16);
            return hex.length == 1 ? '0' + hex : hex;
        };

        return StyleAttributeMapper;
    }();

    exports.default = StyleAttributeMapper;
});