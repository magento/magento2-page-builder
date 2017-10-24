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

    var AttributeMapper = function () {
        function AttributeMapper() {
            _classCallCheck(this, AttributeMapper);
        }

        AttributeMapper.prototype.toDom = function toDom(object) {
            var result = {};
            Object.keys(object).map(function (key) {
                var value = object[key];
                if (key === 'role' || key === 'name') {
                    key = 'data-role';
                }
                if (key === 'appearance') {
                    key = 'data-appearance';
                }
                result[key.replace('_', '-')] = value;
            }.bind(this));
            return result;
        };

        return AttributeMapper;
    }();

    exports.default = AttributeMapper;
});