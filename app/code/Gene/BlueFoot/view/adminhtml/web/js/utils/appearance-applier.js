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

    var AppearanceApplier = function () {
        function AppearanceApplier() {
            _classCallCheck(this, AppearanceApplier);
        }

        AppearanceApplier.prototype.getAppearanceData = function getAppearanceData(data) {
            var attributes = {};
            var role = data['name'] !== 'undefined' ? data['name'] : data['role'];
            if (role === 'column') {
                attributes['flex_grow'] = 1;
                if (data['appearance'] === 'top') {
                    attributes['align_self'] = 'flex-start';
                }
                if (data['appearance'] === 'middle') {
                    attributes['align_self'] = 'center';
                }
                if (data['appearance'] === 'bottom') {
                    attributes['align_self'] = 'flex-end';
                }
            }
            return attributes;
        };

        return AppearanceApplier;
    }();

    exports.default = AppearanceApplier;
});