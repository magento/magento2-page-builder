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

            // Allowed attributes
            this.allowAttributes = ['name', 'appearance'];
        }
        /**
         * Filter allowed attributes from object
         *
         * @param {DataObject} data
         * @returns {DataObject}
         */


        AttributeFilter.prototype.filter = function filter(data) {
            var attributes = {};
            Object.keys(data).map(function (key) {
                if (this.allowAttributes.includes(key)) {
                    attributes[key] = data[key];
                }
            });
            return attributes;
        };

        return AttributeFilter;
    }();

    exports.default = AttributeFilter;
});