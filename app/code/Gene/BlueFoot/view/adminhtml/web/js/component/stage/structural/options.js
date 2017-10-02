define(['exports', 'underscore', 'knockout'], function (exports, _underscore, _knockout) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Options = undefined;

    var _underscore2 = _interopRequireDefault(_underscore);

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

    var Options = exports.Options = function () {
        /**
         * Options constructor
         *
         * @param parent
         * @param options
         */
        function Options(parent, options) {
            _classCallCheck(this, Options);

            this.options = _knockout2.default.observableArray([]);
            this.template = 'Gene_BlueFoot/component/stage/structural/options.html';
            this.parent = parent;
            this.options(options);
            this.sort();
        }
        /**
         * Sort the options
         */


        Options.prototype.sort = function sort() {
            this.options.sort(function (a, b) {
                return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
            });
        };
        /**
         * Add an option into the options array
         *
         * @param option
         */


        Options.prototype.addOption = function addOption(option) {
            this.options.push(option);
            this.sort();
        };
        /**
         * Remove an option
         *
         * @param code
         */


        Options.prototype.removeOption = function removeOption(code) {
            this.options(_underscore2.default.without(this.options(), _underscore2.default.findWhere(this.options(), {
                code: code
            })));
            this.sort();
        };
        /**
         * Retrieve the template
         *
         * @deprecated
         * @returns {string}
         */


        Options.prototype.getTemplate = function getTemplate() {
            return this.template;
        };

        return Options;
    }();
});