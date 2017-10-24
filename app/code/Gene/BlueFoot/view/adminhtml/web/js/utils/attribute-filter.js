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

    var AttributeFilter = function () {
        function AttributeFilter() {
            _classCallCheck(this, AttributeFilter);
        }

        AttributeFilter.prototype.filter = function filter(data) {
            var attributes = {};
            var allowAttributes = ['role', 'name', 'appearance'];
            Object.keys(data).map(function (key) {
                if (allowAttributes.includes(key)) {
                    attributes[key] = data[key];
                }
            });
            return attributes;
        };

        return AttributeFilter;
    }();

    exports.default = AttributeFilter;
});