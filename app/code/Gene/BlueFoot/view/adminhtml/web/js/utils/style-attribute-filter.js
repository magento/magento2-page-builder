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

    var StyleAttributeFilter = function () {
        function StyleAttributeFilter() {
            _classCallCheck(this, StyleAttributeFilter);

            // Allowed style attributes
            this.styleAttributes = ['width', 'height', 'min_height', 'background_color', 'background_image', 'background_size', 'background_attachment', 'background_repeat', 'background_position', 'border_style', 'border_width', 'border_color', 'border_radius', 'margin_top', 'margin_right', 'margin_bottom', 'margin_left', 'padding_top', 'padding_right', 'padding_bottom', 'padding_left'];
        }
        /**
         * Filter allowed style properties from object
         *
         * @param {DataObject} data
         * @returns {DataObject}
         */


        StyleAttributeFilter.prototype.filter = function filter(data) {
            var result = {};
            Object.keys(data).map(function (key) {
                if (Object.values(this.styleAttributes).indexOf(key) > -1) {
                    result[key] = data[key];
                }
            }.bind(this));
            return result;
        };

        return StyleAttributeFilter;
    }();

    exports.default = StyleAttributeFilter;
});