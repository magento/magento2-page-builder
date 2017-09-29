define(['exports', 'knockout'], function (exports, _knockout) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Group = undefined;

    var _knockout2 = _interopRequireDefault(_knockout);

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

    var Group = exports.Group = function () {
        /**
         * Group constructor
         *
         * @param id
         * @param group
         * @param blocks
         *
         * @todo change group type
         */
        function Group(id, group) {
            var blocks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            _classCallCheck(this, Group);

            this.id = _knockout2.default.observable();
            this.code = _knockout2.default.observable('');
            this.name = _knockout2.default.observable('');
            this.icon = _knockout2.default.observable('');
            this.sort = _knockout2.default.observable();
            this.blocks = _knockout2.default.observableArray([]);
            this.active = _knockout2.default.observable(false);
            this.hidden = _knockout2.default.observable(false);
            this.id(id);
            this.code(group.code);
            this.name(group.name);
            this.icon(group.icon);
            this.sort(group.sort);
            this.blocks(blocks);
        }
        /**
         * Toggle the group
         */


        Group.prototype.toggle = function toggle() {
            this.active(!this.active());
        };

        return Group;
    }();
});