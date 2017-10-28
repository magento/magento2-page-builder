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

            // Attribute name mapping
            this.attributeNameMapping = { name: 'data-role', appearance: 'data-appearance' };
        }
        /**
         * Map attribute keys to DOM key names and normalize values
         *
         * @param {DataObject} data
         * @returns {DataObject}
         */


        AttributeMapper.prototype.toDom = function toDom(data) {
            var result = {};
            Object.keys(data).map(function (key) {
                var value = data[key];
                if (key in this.attributeNameMapping) {
                    key = this.attributeNameMapping[key];
                }
                result[key.replace('_', '-')] = value;
            }.bind(this));
            return result;
        };

        return AttributeMapper;
    }();

    exports.default = AttributeMapper;
});