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
        function AppearanceApplier(appearances) {
            _classCallCheck(this, AppearanceApplier);

            this.appearances = appearances;
        }
        /**
         * @param data
         * @returns {DataObject}
         */


        AppearanceApplier.prototype.apply = function apply(data) {
            if (data['appearance'] !== undefined) {
                if (this.appearances[data['appearance']] === undefined) {
                    console.error('No appearances specified for content type.');
                }
                return this.appearances[data['appearance']].apply(data);
            }
            return data;
        };

        return AppearanceApplier;
    }();

    exports.default = AppearanceApplier;
});