define(['exports', 'underscore', '../component/config'], function (exports, _underscore, _config) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _underscore2 = _interopRequireDefault(_underscore);

    var _config2 = _interopRequireDefault(_config);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var AppearanceApplier = function () {
        function AppearanceApplier() {
            _classCallCheck(this, AppearanceApplier);

            // Content types config
            this.contentTypesConfig = _config2.default.getInitConfig('contentTypes');
        }
        /**
         * @param data
         * @returns {object}
         */


        AppearanceApplier.prototype.apply = function apply(data) {
            var appearanceData = {};
            var role = data['name'];
            if (data['appearance'] !== undefined && this.contentTypesConfig[role]['appearance_components'] !== undefined) {
                appearanceData = this.contentTypesConfig[role]['appearance_components'][data['appearance']].getData();
            }
            _underscore2.default.extend(data, appearanceData);
            return data;
        };

        return AppearanceApplier;
    }();

    exports.default = AppearanceApplier;
});