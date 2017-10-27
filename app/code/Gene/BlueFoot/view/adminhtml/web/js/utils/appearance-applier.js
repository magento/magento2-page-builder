define(["exports", "../component/appearance/column/align-top", "../component/appearance/column/align-middle", "../component/appearance/column/align-bottom"], function (exports, _alignTop, _alignMiddle, _alignBottom) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _alignTop2 = _interopRequireDefault(_alignTop);

    var _alignMiddle2 = _interopRequireDefault(_alignMiddle);

    var _alignBottom2 = _interopRequireDefault(_alignBottom);

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

            this.appearances = {
                column: {
                    top: new _alignTop2.default(),
                    middle: new _alignMiddle2.default(),
                    bottom: new _alignBottom2.default()
                }
            };
        }
        /**
         * @param data
         * @returns {object}
         */


        AppearanceApplier.prototype.getAppearanceData = function getAppearanceData(data) {
            var role = data['name'] !== 'undefined' ? data['name'] : data['role'];
            return this.appearances[role] !== undefined && this.appearances[role][data['appearance']] !== undefined ? this.appearances[role][data['appearance']].getData() : {};
        };

        return AppearanceApplier;
    }();

    exports.default = AppearanceApplier;
});